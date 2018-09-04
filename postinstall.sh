#!/bin/bash
declare DIST=./dist
declare BLUE='\033[0;34m' # blue
declare LBLUE='\033[1;34m' # lightblue
declare NC='\033[0m' # No Color
declare DIR=$(pwd)

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
sh src/angular-meta-parser/prepare.sh


h2 "🔧  Install angular-variant-generator dependencies"
sh src/angular-variant-generator/prepare.sh


h2 "🔧  Install sketch-validator dependencies"
sh src/validate/prepare.sh

h2 "🗑  cleanup dist"
rm -rf $DIST

echo "create › dist"
mkdir dist 
echo "create › dist/angular-meta-parser"
mkdir dist/angular-meta-parser
echo "create › dist/angular-variant-generator"
mkdir dist/angular-variant-generator
echo "create › dist/sketch-color-replacer"
mkdir dist/sketch-color-replacer
echo "create › dist/sketch-generator"
mkdir dist/sketch-generator
echo "create › dist/sketch-validator"
mkdir dist/sketch-validator

h2 "⚙️  Build the dependencies"
set -e
./node_modules/.bin/rollup -c || exit 1

success "Everything is installed 🤘🏻"
echo "now you can go ahead with "
echo "  > npm run build:dev"
echo "  > npm run test"
echo "  > npm run lint"
