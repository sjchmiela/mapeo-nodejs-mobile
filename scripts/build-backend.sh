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

echo "Setting up..."
mkdir -p ./nodejs-assets
rm -rf ./nodejs-assets/nodejs-project
if [ -f ./nodejs-assets/BUILD_NATIVE_MODULES.txt ]; then
  echo "Build Native Modules on"
else
  echo '1' >./nodejs-assets/BUILD_NATIVE_MODULES.txt
  echo "Set Build Native Modules on"
fi
cp -r ./src/backend ./nodejs-assets
mv ./nodejs-assets/backend ./nodejs-assets/nodejs-project

echo "Installing dependencies..."
cd ./nodejs-assets/nodejs-project && npm i && cd ../..

echo -en "Minifying with noderify..."
cd ./nodejs-assets/nodejs-project
"$(npm bin)/noderify" \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  --filter=rn-bridge \
  index.js >_index.js
rm index.js
mv _index.js index.js
cd ../..
echo -en " done.\n"

echo "Keeping some node modules..."
declare -a keepThese=("leveldown")
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/nodejs-project/node_modules/$x" ]; then
    mv "./nodejs-assets/nodejs-project/node_modules/$x" "./nodejs-assets/$x"
  fi
done

echo -en "Removing node_modules folder"
rm -rf ./nodejs-assets/nodejs-project/node_modules
mkdir -p ./nodejs-assets/nodejs-project/node_modules

echo "Putting node modules back..."
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/$x" ]; then
    mv "./nodejs-assets/$x" "./nodejs-assets/nodejs-project/node_modules/$x"
  fi
done

echo -en " done.\n"
