module.exports = (data) => {
    let request = {
        appid: data.appId,
        mch_id: data.mchId,
        nonce_str: Common.Toolbox.uuid()
    };

    if (data.hasOwnProperty('wechatOrderId')) {
        request.transaction_id = data.wechatOrderId;
    }
    else if (data.hasOwnProperty('orderId')) {
        request.out_trade_no = data.orderId;
    }
    else {
        throw new Error('bad request data, without wechatOrderId and orderId,' + JSON.stringify(data));
    }

    request.sign = Lib.sign.payment({
        jsonData: request,
        key: data.key,
        signType: Common.Constant.SignType.MD5
    });

    return request;
};