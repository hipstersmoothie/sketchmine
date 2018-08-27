#!/bin/bash
declare TMP=src/validate/_tmp
declare REPO=https://bitbucket.lab.dynatrace.org/scm/rx/angular-components.git
declare BRANCH=master

rm -rf $TMP
mkdir $TMP
git clone --no-checkout --depth=1 -b $BRANCH $REPO $TMP

cd $TMP
git fetch origin $BRANCH
git checkout origin/$BRANCH -- src/lib/core/style/_colors.scss
mv src/lib/core/style/_colors.scss ./_colors.scss
# clean up
rm -rf src
