#============================
# Angular components
#
#----------------------------
FROM alpine/git as angular-components
ARG GIT_PASS
ARG GIT_USER=lukas.holzer
ARG GIT_BRANCH=master
ARG GIT_REPO=https://${GIT_USER}:${GIT_PASS}@bitbucket.lab.dynatrace.org/scm/rx/angular-components.git

WORKDIR /ac
RUN git clone --no-checkout --depth=1 -b ${GIT_BRANCH} ${GIT_REPO} . && \
    git fetch origin ${GIT_BRANCH} && \
    git checkout origin/${GIT_BRANCH} -- tsconfig.json && \
    git checkout origin/${GIT_BRANCH} -- package.json && \
    git checkout origin/${GIT_BRANCH} -- .npmrc && \
    git checkout origin/${GIT_BRANCH} -- src/lib && \
    git checkout origin/${GIT_BRANCH} -- src/docs/components



#============================
# Library base with the build
#
#----------------------------
FROM node:10-alpine as library-base

WORKDIR /_tmp
COPY --from=angular-components /ac/package.json /ac/.npmrc ./
RUN yarn install --ignore-scripts
COPY --from=angular-components /ac/tsconfig.json ./
COPY --from=angular-components /ac/src ./src

WORKDIR /
COPY package.json /
RUN npm install

COPY rollup.config.js tsconfig.json tslint.json ./
COPY config ./config
COPY src ./src

RUN ls -lah ./
RUN node_modules/.bin/rollup -c

CMD []


FROM library-base as library-production

# cleanup image
RUN rm -rf .rpt2_cache \
    package.json \
    package-lock.json \
    src \
    rollup.config.js \
    tsconfig.json \
    tslint.json

CMD ["node", "dist/library"]
