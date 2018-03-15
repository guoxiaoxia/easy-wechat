const Http = Lib.http;
const TestDataConfig = require(`${TEST_DIR}/data/config`);

module.exports = async (request) => {
    if (!request.query.hasOwnProperty('code')){
        LogicLogger.error(`code should exist`)
    }

    const response = {code: request.query.code};

    Lib.schemaCheck(require(`${SCHEMA_DIR}/wechat_callback/mini.login_notify`).response, response);
    await (new Http()).apiAjax(
        new Http.Request.Post(TestDataConfig.SERVER_LOGIN_CALLBACK_URL).setJsonBody({request: response})
    );

    return '';
};
