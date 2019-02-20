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

# echo "Building native modules for armeabi-v7a...";
# cd android;
# if [ -f ./gradlew ]
# then
#   ./gradlew nodejs-mobile-react-native:GenerateNodeNativeAssetsListsarmeabi-v7a
#   ./gradlew nodejs-mobile-react-native:GenerateNodeNativeAssetsListsx86
#   ./gradlew nodejs-mobile-react-native:GenerateNodeNativeAssetsListsarm64-v8a
# else
#   gradle nodejs-mobile-react-native:GenerateNodeNativeAssetsListsarmeabi-v7a
#   gradle nodejs-mobile-react-native:GenerateNodeNativeAssetsListsx86
#   gradle nodejs-mobile-react-native:GenerateNodeNativeAssetsListsarm64-v8a
# fi
# cd ..;
# echo "";

echo -en "Minifying with noderify...";
cd ./nodejs-assets/nodejs-project;
$(npm bin)/noderify \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  --filter=rn-bridge \
  index.js > _index.js;
rm index.js;
mv _index.js index.js;
cd ../..;
echo -en " done.\n";

echo "Keeping some node modules...";
declare -a keepThese=("leveldown")
for x in "${keepThese[@]}"
do
  if [ -e "./nodejs-assets/nodejs-project/node_modules/$x" ]; then
    mv ./nodejs-assets/nodejs-project/node_modules/$x ./nodejs-assets/$x;
  fi
done

# echo -en "Replacing node_modules folder...";
rm -rf ./nodejs-assets/nodejs-project/node_modules/*;
# cp -r ./android/build/nodejs-native-assets/nodejs-native-assets-armeabi-v7a/node_modules ./nodejs-assets/nodejs-project;
# echo -en " done.\n";

echo "Putting node modules back...";
for x in "${keepThese[@]}"
do
  if [ -e "./nodejs-assets/$x" ]; then
    mv ./nodejs-assets/$x ./nodejs-assets/nodejs-project/node_modules/$x;
  fi
done

echo -en "Removing other unused files...";
# make a list of things to delete then delete them
# `-exec rm -rf {} \;` confuses find because the recursion can no longer find a step (depth-first traversal (-d) would also work)
# GNU find and modern BSD/macOS find have a `-delete` operator
# find ./nodejs-assets/nodejs-project \
#   -type d \
#   \( \
#     -name "darwin-x64" \
#     -o -name "win32-ia32" \
#     -o -name "win32-x64" \
#   \) \
#   -print0 | xargs -0 rm -rf # delete everything in the list
echo -en " done.\n";
