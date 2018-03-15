const requestParametersGet = require('./request_parameters_get');
const Http = Lib.http;

module.exports = async(request) => {
    let response = await send(generateRequest(request));
    response = generateResponse(request, response);
    await record(request);
    return response;
};

function generateRequest(request) {
    return Common.Toolbox.jsonToXml({xml:requestParametersGet(request)});
}

function generateResponse(request, response) {
    let response = {
        appId: request.appId,
        nonceStr: response.nonce_str,
        package: `prepay_id=${response.prepay_id}`,
        signType: Common.Constant.SignType.MD5,
        timeStamp: Common.Toolbox.timeNow(),
        codeUrl: response.hasOwnProperty('code_url') ? response.code_url : undefined
    };

    response.paySign = Lib.sign.payment({
        jsonData: response,
        key: request.key,
        signType: Common.Constant.SignType.MD5
    });

    return response;
}

async function send(request) {
    let response = await new Http().wechatAjax(
        new Http.Request.Post('https://api.mch.weixin.qq.com/pay/unifiedorder').setRawBody(request)
    );

    return await Common.Toolbox.asyncXmlToJson(response);
}

/**
 * 记录回调地址，生成订单，避免重复回调
 */
async function record(request) {
    await SmartModel.insert('order').data({
        orderId: request.orderId,
        paymentKey: request.key,
        orderPrice: request.price,
        tradeType: Common.Constant.Payment.TradeType[request.tradeType],
        notifyUrl: request.notifyUrl,
        submittedTime: Common.Toolbox.timeNow(),
        status: Common.Constant.Payment.Status.UNPAID,
    }).run();
}