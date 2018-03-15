#!/bin/bash
if [ `uname` == 'Darwin' ]; then
        READLINK=greadlink
else
        READLINK=readlink
fi

PROJECT_ROOT=$(realpath $(dirname $($READLINK -f "$0"))"/..")

function acquire
{
    >&2 echo -n "Enter ${1}(default=${2}):"
    read VALUE
    if [ "$VALUE" == "" ]; then
        VALUE=${2}
    fi
    echo $VALUE
}

SCENES=$(acquire "SCENES" "simulator")
HOST=$(acquire "HOST" "0.0.0.0")
PORT=$(acquire "PORT" "12345")
LOG_PATH=$(acquire "LOG_PATH" ${PROJECT_ROOT}/logs/)

mkdir -p ${PROJECT_ROOT}/.deployment/
echo "module.exports = {" > ${PROJECT_ROOT}/.deployment/config.js
echo "  SCENES:\"${SCENES}\"," >> ${PROJECT_ROOT}/.deployment/config.js
echo "  LOG_PATH:\"${LOG_PATH}\"," >> ${PROJECT_ROOT}/.deployment/config.js
echo "  HOST:\"${HOST}\"," >> ${PROJECT_ROOT}/.deployment/config.js
echo "  PORT:${PORT}" >> ${PROJECT_ROOT}/.deployment/config.js
echo "};" >> ${PROJECT_ROOT}/.deployment/config.js

echo "step1. init config"
rm -rf ${PROJECT_ROOT}/config/.target
ln -s ${PROJECT_ROOT}/config/${SCENES} ${PROJECT_ROOT}/config/.target

echo "step2. npm install"
cd ${PROJECT_ROOT}/
npm install

echo "step3. create databases..."
RESULT=0
smart-model -a diagnose -m ${PROJECT_ROOT}/model/definition -c ${PROJECT_ROOT}/config/.target/database || RESULT=$?
if [ $RESULT -ne 0 ]; then
        exit -1
else
        smart-model -a setup -m ${PROJECT_ROOT}/model/definition -c ${PROJECT_ROOT}/config/.target/database
fi

echo "done"