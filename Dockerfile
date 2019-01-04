#============================
# Angular components
#
#----------------------------
FROM alpine/git as material2
ARG GIT_TAG=7.1.1
ARG GIT_REPO=https://github.com/angular/material2.git

WORKDIR /ac
RUN git clone --no-checkout --depth=1 -b ${GIT_TAG} ${GIT_REPO} . && \
    git fetch origin && \
    git checkout tags/${GIT_TAG}

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
COPY --from=material2 \
     /ac/package.json \
     ${TMP}/

RUN yarn install --ignore-scripts
COPY --from=material2 \
     /ac/tsconfig.json \
     ${TMP}/
COPY --from=material2 \
     /ac/src\
     ${TMP}/src


# install the library (build etc.)
WORKDIR ${LIB_FOLDER}
COPY package.json ./
COPY packages/app-builder/package.json ./packages/app-builder/package.json
COPY packages/code-analyzer/package.json ./packages/code-analyzer/package.json
COPY packages/dom-agent/package.json ./packages/dom-agent/package.json
COPY packages/helpers/package.json ./packages/helpers/package.json
COPY packages/library/package.json ./packages/library/package.json
COPY packages/node-helpers/package.json ./packages/node-helpers/package.json
COPY packages/sketch-builder/package.json ./packages/sketch-builder/package.json
COPY packages/sketch-file-builder/package.json ./packages/sketch-file-builder/package.json
COPY packages/sketch-file-format/package.json ./packages/sketch-file-format/package.json
COPY packages/sketch-svg-parser/package.json ./packages/sketch-svg-parser/package.json
COPY packages/sketch-validator/package.json ./packages/sketch-validator/package.json
COPY packages/sketch-validator-nodejs-wrapper/package.json ./packages/sketch-validator-nodejs-wrapper/package.json

RUN yarn

# copy build stuff for library
COPY lerna.json \
     jest.config.* \
     yarn.lock \
     tsconfig.json \
     tslint.json \
     ${LIB_FOLDER}/
COPY config ./config
COPY packages ./packages

RUN yarn build