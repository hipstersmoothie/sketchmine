#!/bin/bash

declare GIT_TAG="1.5.0"
declare GIT_REPO="https://bitbucket.lab.dynatrace.org/scm/rx/angular-components.git"

declare COMP_VOL_NAME="SketchmineComponentsLibrary"
declare SHARED_VOL_NAME="SketchmineShared"
declare APP_VOL_NAME="SketchmineApp"
declare APP_NETWORK="SketchmineNetwork"


echo "
                                                           .     '     ,
      _        _       _               _                     _________
  ___| | _____| |_ ___| |__  _ __ ___ (_)_ __   ___       _ /_|_____|_\ _
 / __| |/ / _ \ __/ __| '_ \| '_ \` _ \| | '_ \ / _ \        '. \   / .'
 \__ \   <  __/ || (__| | | | | | | | | | | | |  __/          '.\ /.'
 |___/_|\_\___|\__\___|_| |_|_| |_| |_|_|_| |_|\___|            '.'

 A place to scrape Diamonds"


h2() {
	printf '\n\e[1;33m==>\e[37;1m %s\e[0m\n' "$*"
}

h2 "Create Volumes 💾"
echo "Create Volumes"
docker volume create --name $COMP_VOL_NAME
docker volume create --name $SHARED_VOL_NAME
docker volume create --name $APP_VOL_NAME
echo "Create Network"
docker network create -d bridge $APP_NETWORK || true


h2 "Build Components Library"
docker build \
  -t sketchmine/components-library \
  . \
  -f ./config/Dockerfile \
  --build-arg GIT_TAG=$GIT_TAG \
  --build-arg GIT_REPO=$GIT_REPO


h2 "Build Code Analyzer"
docker build -t sketchmine/code-analyzer . -f ./packages/code-analyzer/Dockerfile

h2 "Build App Builder"
docker build -t sketchmine/app-builder . -f ./packages/app-builder/Dockerfile

h2 "Build Sketch Builder"
docker build -t sketchmine/sketch-builder . -f ./packages/sketch-builder/Dockerfile

h2 "Generate Examples Module 🏃🏻‍"
docker run --rm \
  --name components_library \
  -v $COMP_VOL_NAME:/components-library \
  sketchmine/components-library \
  /bin/sh -c './node_modules/.bin/gulp barista-example:generate'

h2 "Generate meta-information.json 🕵🏻‍"
docker run --rm \
  --name code_analyzer \
  -v $COMP_VOL_NAME:/angular-components \
  -v $SHARED_VOL_NAME:/shared \
  sketchmine/code-analyzer \
  /bin/sh -c 'node ./lib/bin --config="config.json"'

h2 "Generate examples angular application 🧰"
docker run --rm \
  --name app_builder \
  -v $COMP_VOL_NAME:/angular-components \
  -v $SHARED_VOL_NAME:/shared \
  -v $APP_VOL_NAME:/app-shell \
  sketchmine/app-builder \
  /bin/sh -c '\
    yarn schematics --config="config.json" --dryRun=false && \
    mkdir -p ./sketch-library/src/assets && \
    cp /shared/* ./sketch-library/src/assets/ && \
    cd ./sketch-library && \
    yarn ng build && \
    cd dist && \
    cp -R ./angular-app-shell/* /app-shell'


h2 "Start Webserver 🌍"

docker run --rm \
  -v $APP_VOL_NAME:/usr/share/nginx/html \
  --name web_server \
  --net $APP_NETWORK \
  -p 4200:80 \
  -d \
  nginx:alpine

h2 "Generate the Sketch file 💎"
docker run -it --rm \
  -e DOCKER=true \
  -e DEBUG=true \
  --cap-add=SYS_ADMIN \
  --name sketch_builder \
  --net ${APP_NETWORK} \
  -v ${APP_VOL_NAME}:/app-shell \
  -v "$(pwd)"/_library:/generated \
  sketchmine/sketch-builder \
  /bin/sh -c 'node ./lib/bin --config="config.json"'

h2 "Clean up 🧹"

echo "Stop Nginx Web Server"
docker stop web_server

echo "Remove Volumes"
docker volume rm $COMP_VOL_NAME
docker volume rm $SHARED_VOL_NAME
docker volume rm $APP_VOL_NAME

echo "Remove Networks"
docker network rm $APP_NETWORK
