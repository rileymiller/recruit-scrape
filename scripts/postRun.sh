#!/bin/bash -el


cd "$(dirname "${BASH_SOURCE[0]}")" && cd ..;


echo "You've entered the postrun"

echo "Listing build/ files"
ls build

echo "Kicking off skeleton upload script"

$(npm bin)/ts-node ./scripts/upload/uploadBuild.ts

