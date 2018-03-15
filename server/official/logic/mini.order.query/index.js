const requestParametersGet = require('./request_parameters_get');
const Http = Lib.http;

module.exports = async(request) => {
    let response = await send(generateRequest(request));
    return await generateResponse(response);
};

function generateRequest(request) {
    return Common.Toolbox.jsonToXml({xml:requestParametersGet(request)});
}

async function generateResponse(response) {
    response = await Common.Toolbox.asyncXmlToJson(response);
    return {
        tradeState: Common.Constant.Payment.TradeStatus[response.trade_state],
        totalFee: response.total_fee,
        timeEnd: response.hasOwnProperty('time_end') ? Common.Toolbox.dateStringToTimeStamp(response.time_end) : undefined,
        isSubscribe: response.hasOwnProperty('is_subscribe') ? response.is_subscribe === 'Y' : undefined
    }
}

async function send(request) {
    return await new Http().wechatAjax(
        new Http.Request.Post('https://api.mch.weixin.qq.com/pay/orderquery').setRawBody(request)
    );
}
