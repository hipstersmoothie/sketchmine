FROM node:10-alpine as app-builder
WORKDIR /app-builder

ENV PACKAGE=packages/app-builder

COPY ${PACKAGE}/package.json ./

RUN yarn

COPY ${PACKAGE}/src ./src
COPY ${PACKAGE}/tsconfig.json \
     ${PACKAGE}/config.json \
     ${PACKAGE}/gulpfile.js \
     ${PACKAGE}/Docker.sh ./

# Copy root tsconfig
COPY ./tsconfig.json /
COPY ./config /config

EXPOSE 4200

RUN yarn build
