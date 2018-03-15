let response = {
    type: "object",
    description: "支付回调通知接口",
    properties: {
        orderId: {
            type: "string",
            description: "商户订单号"
        },
        wechatTransactionId: {
            type: "string",
            description: "微信支付订单号"
        },
        orderPrice: {
            type: "integer",
            description: "订单金额"
        },
        isSubscribe: {
            type: "boolean",
            description: "是否关注公众账号"
        },
        finishedTime: {
            type: "integer",
            description: "支付完成时间"
        }
    },
    additionalProperties: false,
    required: ["orderId", "wechatTransactionId", "orderPrice", "isSubscribe", "finishedTime"]
};

module.exports = {response};