FROM node:10-alpine as code-analyzer
WORKDIR /sketch-validator

ENV PACKAGE=packages/sketch-validator-nodejs-wrapper

COPY ${PACKAGE}/package.json ./

RUN yarn

COPY ${PACKAGE}/src ./src
COPY ${PACKAGE}/rollup.config.js \
     ${PACKAGE}/sketchlint.json \
     ${PACKAGE}/tsconfig.json ./

# Copy root tsconfig
COPY ./tsconfig.json /
COPY ./config /config

RUN yarn build

