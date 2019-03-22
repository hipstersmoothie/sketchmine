#!/bin/bash

changed_packages="$(npx lerna changed | grep "@sketchmine" | paste -sd "," -)"
echo "lerna run --scope={${changed_packages}} lint"
