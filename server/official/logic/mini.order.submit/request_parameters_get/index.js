module.exports = (request) => {
    //组装必要参数
    return getNecessary(request);
};

function getNecessary(data) {
    let request = {
        appid: data.appId,
        mch_id: data.mchId,
        nonce_str: Common.Toolbox.uuid(),
        body: data.description,
        out_trade_no: data.orderId,
        total_fee: data.price,
        spbill_create_ip: Common.Constant.Payment.BillCreateIp,
        notify_url: `${Config.Proxy}${Common.Constant.Payment.MINI_PAYMENT_NOTIFY_URL}`,
        trade_type: data.tradeType,
        fee_type: Common.Constant.Payment.FeeType
    };

    switch (data.tradeType) {
        case Common.Constant.Payment.TradeType.NATIVE:
            request.product_id = data.productId;
            break;
        case Common.Constant.Payment.TradeType.JSAPI:
            request.openid = data.openId;
    }

    request.sign = Lib.sign.payment({
        jsonData: request,
        key: data.key,
        signType: Common.Constant.SignType.MD5
    });

    return request;

}