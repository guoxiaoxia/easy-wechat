let request = {
    type: "object",
    description: "该接口提供所有微信支付订单的查询，商户可以通过查询订单接口主动查询订单状态",
    oneOf: [
        {
            properties: {
                appId: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "小程序唯一标识"
                },
                mchId: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "商户id"
                },
                key: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "支付密钥key"
                },
                orderId: {
                    type: "string",
                    pattern: "^[0-9a-zA-Z]{1,32}$",
                    description: "订单号"
                }
            },
            additionalProperties: false,
            required: ["appId", "mchId", "key", "orderId"]
        },
        {
            properties: {
                appId: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "小程序唯一标识"
                },
                mchId: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "商户id"
                },
                key: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "支付密钥key"
                },
                wechatOrderId: {
                    type: "string",
                    pattern: "^.{1,32}$",
                    description: "微信订单号"
                }
            },
            additionalProperties: false,
            required: ["appId", "mchId", "key", "wechatOrderId"]
        }
    ]
};

let response = {
    type: "object",
    switch: [
        {
            if: {
                properties: {
                    tradeState: {
                        type: "integer",
                        enum: [Common.Constant.Payment.TradeStatus.SUCCESS],
                        description: "订单交易成功"
                    }
                }
            },
            then: {
                properties: {
                    tradeState: {
                        type: "integer",
                        enum: Object.values(Common.Constant.Payment.TradeStatus),
                        description: "订单交易状态"
                    },
                    totalFee: {
                        type: "integer",
                        description: "订单总金额，单位为分"
                    },
                    timeEnd: {
                        type: "integer",
                        description: "订单支付时间"
                    },
                    isSubscribe: {
                        type: "boolean",
                        description: "用户是否关注公众账号，仅在公众账号类型支付时有效"
                    },
                },
                additionalProperties: false,
                required: ["tradeState", "totalFee", "timeEnd", "isSubscribe"]
            },
            continue: false
        },
        {
            if: {
                properties: {
                    tradeState: {
                        type: "integer",
                        enum: [Common.Constant.Payment.TradeStatus.NOTPAY],
                        description: "订单交易未支付"
                    }
                }
            },
            then: {
                properties: {
                    tradeState: {
                        type: "integer",
                        enum: Object.values(Common.Constant.Payment.TradeStatus),
                        description: "订单交易状态"
                    }
                },
                additionalProperties: false,
                required: ["tradeState"]
            }
        }
    ]
};

module.exports = {request, response};