require('../env');
const opts = require('opts');
opts.parse([
    {
        short: 'h',
        long: 'host',
        description: 'host to listen',
        value: true,
        required: true
    },
    {
        short: 'p',
        long: 'port',
        description: 'port to listen',
        value: true,
        required: true
    },
    {
        short: 's',
        long: 'scenes',
        description: 'scenes <simulator|official>',
        value: true,
        required: true
    },
    {
        short: 'l',
        long: 'log-path',
        description: 'log-path',
        value: true,
        required: false
    }
], [], true);
const HOST = opts.get('host');
const PORT = parseInt(opts.get('port'));
const SCENES = opts.get('scenes');
const LOG_PATH = opts.get('log-path');

//配置log
const log4js = Config.Logger(LOG_PATH);
global.Logger = log4js.default;
global.LogicLogger = log4js.logic;
global.WechatPackageLogger = log4js.wechatPackage;

//业务服务器
const url = require('url');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const xmlBodyParser = require('express-xml-bodyparser');

app.use(xmlBodyParser());
app.all('/callback/*', dealWithCallback);

app.use(bodyParser.json());
//debug test
app.post('/appServer/*', dealWithAppServer);
app.post('/*', dealWithLogic);

app.listen(PORT, HOST);

async function dealWithCallback(req, res) {
    try {
        const name = url.parse(req.url).pathname.split('/')[2];

        WechatPackageLogger.info(`[wechatCallback] [request] [${name}]: ${req.rawBody}`);
        const impl = require(`${PROJECT_ROOT}/server/${SCENES}/wechat/${name}`);
        const response = await impl(req);
        WechatPackageLogger.info(`[wechatCallback] [response] [${name}]: ${response}`);

        res.end(response);
    }
    catch(err) {
        Logger.error(err.stack);
        res.status(500).end();
    }
}

async function dealWithLogic(req, res) {
    try {
        let request = req.body;
        const name = url.parse(req.url).pathname.split('/')[1];

        LogicLogger.info(`[request] [${name}]: ${JSON.stringify(request)}`);
        Lib.schemaCheck(require(`${SCHEMA_DIR}/logic/${name}`).request, request);

        let impl = require(`${PROJECT_ROOT}/server/${SCENES}/logic/${name}`);
        let response = await impl(request);

        Lib.schemaCheck(require(`${SCHEMA_DIR}/logic/${name}`).response, response);
        LogicLogger.info(`[response] [${name}]: ${JSON.stringify(response)}`);

        res.end(JSON.stringify(response));
    }
    catch(err) {
        Logger.error(err.stack);
        res.status(500).end();
    }
}

async function dealWithAppServer(req, res) {
    try {
        let request = req.body.request;
        const name = url.parse(req.url).pathname.split('/')[2];

        LogicLogger.info(`[app request] [${name}]: ${JSON.stringify(request)}`);
        let impl = require(`${PROJECT_ROOT}/test/data/app_server/${name}`);
        let response = await impl(request);
        LogicLogger.info(`[app response] [${name}]: ${JSON.stringify(response)}`);

        res.end(JSON.stringify(response));
    }
    catch(err) {
        Logger.error(err.stack);
        res.status(500).end();
    }
}