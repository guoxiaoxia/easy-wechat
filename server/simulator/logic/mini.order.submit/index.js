module.exports = async(request) => {
    await record(request);
    let prepayId = `wx${Common.Toolbox.timeNow()}`;
    let response = {
        appId: request.appId,
        nonceStr: 'fake_nonce_str',
        package: `prepay_id=${prepayId}`,
        signType: Common.Constant.SignType.MD5,
        timeStamp: Common.Toolbox.timeNow(),
        codeUrl: request.tradeType === Common.Constant.Payment.TradeType.NATIVE ? 'weixin://wxpay/xxx?pr=xxxa' : undefined
    };

    response.paySign = Lib.sign.payment({
        jsonData: response,
        key: request.key,
        signType: Common.Constant.SignType.MD5
    });

    return response;
};

/**
 * 记录回调地址，生成订单，避免重复回调
 */
async function record(request) {
    await SmartModel.insert('fake_order').data({
        orderId: request.orderId,
        wechatOrderId: Common.Toolbox.uuid(),
        orderPrice: request.price,
        tradeType: Common.Constant.Payment.TradeType[request.tradeType],
        notifyUrl: request.notifyUrl,
        status: Common.Constant.Payment.Status.UNPAID
    }).run();
}