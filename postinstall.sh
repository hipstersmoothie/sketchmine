#!/bin/bash
# colors
declare BLUE='\033[0;34m' # blue
declare LBLUE='\033[1;34m' # lightblue
declare LGRAY='\033[0;37m' # light gray
declare NC='\033[0m' # No Color
# paths
declare DIR=$(pwd)
declare DIST=${DIR}/dist
declare APPSHELL=${DIR}/config/angular-app-shell

h2() {
	printf '\n\e[1;33m==>\e[37;1m %s\e[0m\n' "$*"
}

success() {
	printf '\n\e[0;32m✅  \e %s\e[0m\n\n' "$*"
}

failure() {
	printf '\n\e[0;31m❌ \e %s\e[0m\n\n' "$*"
}

printf "$(<./config/ascii-header.rtf)"
echo "\ncurrently working in: $DIR"

h2 "🔧  Install angular-meta-parser dependencies"
sh ${DIR}/src/angular-meta-parser/prepare.sh


h2 "🔧  Install angular-library-generator dependencies"
sh ${DIR}/src/angular-library-generator/prepare.sh


h2 "🔧  Install sketch-validator dependencies"
sh ${DIR}/src/validate/prepare.sh

h2 "🗑  cleanup dist"
rm -rf $DIST

echo "${LBLUE}create${NC} › dist"
mkdir $DIST 
echo "${LBLUE}create${NC} › dist/angular-meta-parser"
mkdir $DIST/angular-meta-parser
echo "${LBLUE}create${NC} › dist/angular-library-generator"
mkdir $DIST/angular-library-generator
echo "${LBLUE}create${NC} › dist/dom-traverser"
mkdir $DIST/dom-traverser
echo "${LBLUE}create${NC} › dist/sketch-color-replacer"
mkdir $DIST/sketch-color-replacer
echo "${LBLUE}create${NC} › dist/sketch-generator"
mkdir $DIST/sketch-generator
echo "${LBLUE}create${NC} › dist/sketch-validator"
mkdir $DIST/sketch-validator

# Angular App shell instanciating
sh ${DIR}/src/angular-library-generator/prepare-library.sh

cd $DIR

h2 "⚙️  Build the dependencies"
set -e
$DIR/node_modules/.bin/rollup -c || exit 1

success "Everything is installed 🤘🏻"
echo "now you can go ahead with "
echo "  > npm run build:dev"
echo "  > npm run test"
echo "  > npm run lint"
