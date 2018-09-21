#============================
# Angular components
#
#----------------------------
FROM alpine/git as angular-components
ARG GIT_PASS
ARG GIT_USER
ARG GIT_BRANCH=feat/poc-sketch
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
# Puppeteer runable environment
# setup all for headless chrome
#----------------------------
FROM node:10-alpine as headless-chrome-environment

# install headless chrome 
RUN mkdir -p /lib && \
    apk update && \
    apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge

#============================
# Library base with the build
#
#----------------------------
FROM headless-chrome-environment as library-base
# folders
ENV LIB_FOLDER=/lib
ENV TMP=${LIB_FOLDER}/_tmp
ENV DIST_FOLDER=${LIB_FOLDER}/dist/
ENV APP=${DIST_FOLDER}/sketch-library

# copy and install the angular components in a _tmp folder
WORKDIR ${TMP}
COPY --from=angular-components \
     /ac/package.json \
     /ac/.npmrc \
     ${TMP}/

RUN yarn install --ignore-scripts
COPY --from=angular-components \
     /ac/tsconfig.json \
     ${TMP}/
COPY --from=angular-components \
     /ac/src\
     ${TMP}/src

# prepare the angular app with the variants
WORKDIR ${APP}
COPY /config/angular-app-shell/.npmrc \ 
     /config/angular-app-shell/package.json \
     ${APP}/
RUN npm install
COPY /config/angular-app-shell/ ./

# install the library (build etc.)
WORKDIR ${LIB_FOLDER}
COPY package.json ./
RUN npm install

# copy build stuff for library
COPY rollup.config.js \
     tsconfig.json \
     tslint.json \
     ${LIB_FOLDER}/
COPY config ${LIB_FOLDER}/config
COPY src ${LIB_FOLDER}/src


RUN node_modules/.bin/rollup -c


#============================
# Library production target
#
#----------------------------
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
