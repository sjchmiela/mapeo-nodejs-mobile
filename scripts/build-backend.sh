#!/bin/bash

# Any copyright is dedicated to the Public Domain.
# http://creativecommons.org/publicdomain/zero/1.0/

set -eEu -o pipefail
shopt -s extdebug
IFS=$'\n\t'
trap 'onFailure $?' ERR

function onFailure() {
  echo "Unhandled script error $1 at ${BASH_SOURCE[0]}:${BASH_LINENO[0]}" >&2
  exit 1
}

echo "Setting up...";
mkdir -p ./nodejs-assets;
rm -rf ./nodejs-assets/nodejs-project;
if [ -f ./nodejs-assets/BUILD_NATIVE_MODULES.txt ]
then
  echo "Build Native Modules on";
else
  echo '1' >./nodejs-assets/BUILD_NATIVE_MODULES.txt;
  echo "Set Build Native Modules on";
fi
cp -r ./src/backend ./nodejs-assets;
mv ./nodejs-assets/backend ./nodejs-assets/nodejs-project;

echo "Installing dependencies...";
cd ./nodejs-assets/nodejs-project && npm i && cd ../..;

echo "Done.";
