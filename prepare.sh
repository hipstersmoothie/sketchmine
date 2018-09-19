#!/bin/bash
declare LBLUE='\033[1;34m' # lightblue
declare LGRAY='\033[0;37m' # light gray
declare NC='\033[0m' # No Color
# paths
declare DIR=$(pwd)
declare DIST=${DIR}/dist
declare APPSHELL=${DIR}/config/angular-app-shell
declare TMP=_tmp
declare REPO=https://bitbucket.lab.dynatrace.org/scm/rx/angular-components.git
declare BRANCH=master


# rm -rf $TMP
# mkdir $TMP
# git clone --no-checkout --depth=1 -b $BRANCH $REPO $TMP

# cd $TMP
# git fetch origin $BRANCH
# git checkout origin/$BRANCH -- tsconfig.json
# git checkout origin/$BRANCH -- package.json
# git checkout origin/$BRANCH -- .npmrc
# git checkout origin/$BRANCH -- src/lib
# git checkout origin/$BRANCH -- src/docs/components

# # install dependencies for @dynatrace/dt-icontype
# npm install --ignore-scripts


# Angular App shell instanciating
echo "${LBLUE}generate${NC} › angular-app-shell ${LGRAY}for the angular variants generator"
rm -rf $DIST/sketch-library
cp -R $APPSHELL $DIST/sketch-library
cd $DIST/sketch-library
echo "${LGRAY} install angular dependencies"
npm i || exit 1
echo "🔪  ${LGRAY}removing sample data from angular-app-shell"
rm -rf $DIST/sketch-library/src/app/examples
rm -rf $DIST/sketch-library/src/app/app.module.ts
