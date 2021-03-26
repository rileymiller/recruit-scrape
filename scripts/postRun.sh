#!/bin/bash -el


cd "$(dirname "${BASH_SOURCE[0]}")" && cd ..;


echo "You've entered the postrun"

echo "Listing build/ files"
ls build