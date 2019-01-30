#!/bin/bash

declare default_environment="product"
declare validation_version="latest"
declare FAILURE=0

red="$(tput setaf 1)"
yellow="$(tput setaf 3)"
cyan="$(tput setaf 6)"
bold="$(tput bold)"
normal="$(tput sgr0)"
dim=$'\e[2m'


path_resolve() {
  echo "$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
}

h2() {
	printf "\n\n${bold}${yellow}==>${cyan} $*${normal}\n"
}

validate_files() {
  # make path absolute
  local search_folder=$(path_resolve $1)
  local environment="$2"
  local extension="*.sketch"

  for file in $(find $search_folder -name $extension );
  do
    h2 "Start validating: ${normal}${file}\n\n"
    validate_sketchfile $file $environment
  done
}

validate_sketchfile() {
  # check if file was provided
  if  ! [[ -e $1 ]]; then
    echo "No File to validate!"; exit 1;
  fi;

  local environment="${2:-$default_environment}"
  local file_dir="$(dirname "$1")"
  local volume_dir="$(cd "$(dirname "$1")/../"; pwd)"
  local dir=${file_dir#"$volume_dir"}
  local file="${dir}/$(basename "$1")"

  docker run -t \
    -e ENVIRONMENT="$environment" \
    -v $volume_dir:/validation-files \
    sketchmine/sketch-validator:${validation_version} \
    node lib/bin \
      --file /validation-files$file || FAILURE=1
}

# if filepath is provided validate only this file
if [ -a $1 ]; then
  validate_sketchfile $1 $2
  exit $FAILURE;
fi


read -e -p "Enter a directory: " BASEPATH
read -p "Enter an environment: ${dim}($default_environment)${normal} " ENVIRONMENT; : ${ENVIRONMENT:=$default_environment}
read -p "Re-Build validation 🐳 image? ${dim}(no)${normal} " BUILD_IMAGE; : ${BUILD_IMAGE:='no'}


if [ "$BUILD_IMAGE" == "no" ]; then
  docker pull sketchmine/sketch-validator:$validation_version
else
  docker build -t sketchmine/sketch-validator . -f ./packages/sketch-validator-nodejs-wrapper/Dockerfile
fi

validate_files $BASEPATH $ENVIRONMENT

exit $FAILURE;
