#!/bin/bash
declare LBLUE='\033[1;34m' # lightblue
declare LGRAY='\033[0;37m' # light gray
declare NC='\033[0m' # No Color
# paths
declare DIR=$(pwd)
declare DIST=${DIR}/dist
declare APPSHELL=${DIR}/config/angular-app-shell


# Angular App shell instanciating

echo "${LBLUE}generate${NC} › angular-app-shell ${LGRAY}for the angular variants generator"
cp -R $APPSHELL $DIST/sketch-library
cd $DIST/sketch-library
echo "${LGRAY} install angular dependencies"
npm i || exit 1
echo "🔪  ${LGRAY}removing sample data from angular-app-shell"
rm -rf $DIST/sketch-library/src/app/examples
rm -rf $DIST/sketch-library/src/app/app.module.ts
