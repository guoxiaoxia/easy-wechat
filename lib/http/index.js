const Crawler =  require('webagent');
const assert = require('assert');

module.exports = class Http extends Crawler{
    async wechatAjax(request){
        WechatPackageLogger.info('[wechat-raw-request]', request);
        let response = await this._ajax(request);
        WechatPackageLogger.info('[wechat-raw-response]', response.textBody);
        return response;
    }

    async apiAjax(request){
        LogicLogger.info('[api callback request]', JSON.stringify(request._bodyData));
        let response = await this._ajax(request);
        LogicLogger.info('[api callback response]', JSON.stringify(response));
        return response;
    }


    async _ajax(request){
        let response = await super.ajax(request);
        assert(response.status === 200, `error response status [${response.status}]`);
        return response.textBody;
    }
};