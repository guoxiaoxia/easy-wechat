#!/bin/bash
SERVER_NAME='easy_wechat_server'

if [ `uname` == 'Darwin' ]; then
        READLINK=greadlink
else
        READLINK=readlink
fi

PROJECT_ROOT=$(realpath $(dirname $($READLINK -f "$0"))"/..")

SCENES=$(cat ${PROJECT_ROOT}/.deployment/config.js | grep SCENES | awk -F":" '{print $2}' | awk -F"\"" '{print $2}')
LOG_PATH=$(cat ${PROJECT_ROOT}/.deployment/config.js | grep LOG_PATH | awk -F":" '{print $2}' | awk -F"\"" '{print $2}')
HOST=$(cat ${PROJECT_ROOT}/.deployment/config.js | grep HOST | awk -F":" '{print $2}' | awk -F"\"" '{print $2}')
PORT=$(cat ${PROJECT_ROOT}/.deployment/config.js | grep PORT | awk -F":" '{print $2}')

pm2 list | grep ${SERVER_NAME} > /dev/null && echo -e "\033[0;31m${SERVER_NAME} already started\033[0m" && exit -1

WECHAT_IMPL=$1 pm2 start ${PROJECT_ROOT}/server/index.js -s \
    --name=${SERVER_NAME} \
    --watch ${PROJECT_ROOT}/server/ \
    --watch ${PROJECT_ROOT}/common/ \
    --watch ${PROJECT_ROOT}/schema/ \
    --watch ${PROJECT_ROOT}/config/ \
    --watch ${PROJECT_ROOT}/lib/    \
    -- --host ${HOST} --port ${PORT} --scenes ${SCENES} --log-path ${LOG_PATH}
