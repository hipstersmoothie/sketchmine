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


FROM headless-chrome-environment as sketch-builder
WORKDIR /sketch-builder

ENV PACKAGE=packages/sketch-builder

COPY ${PACKAGE}/package.json ./

RUN yarn

COPY ${PACKAGE}/src ./src
COPY ${PACKAGE}/rollup.config.js \
     ${PACKAGE}/tsconfig.json ./

# Copy root tsconfig
COPY ./tsconfig.json /
COPY ./config /config

RUN yarn build
