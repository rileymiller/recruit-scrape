#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../..;

STARTTIME=$(date +%s)

echo "Cleaning Workspace"

rm -r build/

mkdir -p build

echo "INFO: Run scrape with ${@}"

set +e

$(npm bin)/cypress run "${@}"


if [ $? != 0 ] ; then
  echo "ERROR: Tests failed logging"
  # TODO: implement dynamic update here
fi


echo "INFO: finished scraping, running postRun"

./scripts/postRun.sh

ENDTIME=$(date +%s)

echo "${@} scrape completed in $((ENDTIME - STARTTIME)) seconds"
