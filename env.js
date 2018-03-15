global.PROJECT_ROOT = __dirname;
global.SCHEMA_DIR = `${PROJECT_ROOT}/schema/`;
global.TEST_DIR = `${PROJECT_ROOT}/test/`;
global.Common = require('./common');
global.Config = require(`./config/.target/index.js`);
global.Lib = require('./lib');
//启动smartmodel
global.SmartModel = require('smart-model');
SmartModel.setup(`${__dirname}/model/definition/`, `${__dirname}/config/.target/database/`);
