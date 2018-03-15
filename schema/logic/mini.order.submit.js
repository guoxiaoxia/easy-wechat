let request = {
    type: "object",
    description: "商户在小程序中先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易后调起支付。",
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
        },
        price: {
            type: "integer",
            description: "金额(单位：分)"
        },
        description: {
            type: "string",
            pattern: "^.{1,128}$",
            default: "趣保-充值",
            description: "商品描述"
        },
        tradeType: {
            type: "string",
            enum: Object.values(Common.Constant.Payment.TradeType),
            description: "交易类型"
        },
        notifyUrl: {
            type: "string",
            description: "异步接收微信支付结果通知的回调地址"
        },
        productId: {
            type: "string",
            description: "商品ID,trade_type=NATIVE时（即扫码支付），此参数必传。"
        },
        openId: {
            type: "string",
            description: "用户标识,trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。"
        }
    },
    additionalProperties: false,
    switch: [
        {
            if: {
                properties: { tradeType: {enum:[Common.Constant.Payment.TradeType.NATIVE]} }
            },
            then: {
                required: ["appId", "mchId", "key", "orderId", "price", "tradeType", "notifyUrl", "productId"]
            },
            continue: false
        },
        {
            if: {
                properties: { tradeType: {enum:[Common.Constant.Payment.TradeType.JSAPI]} }
            },
            then: {
                required: ["appId", "mchId", "key", "orderId", "price", "tradeType", "notifyUrl", "openId"]
            }
        }
    ]
};

let response = {
    type: "object",
    description: "返回支付参数",
    properties: {
        appId: {
            type: "string",
            pattern: "^.{1,32}$",
            description: "小程序唯一标识"
        },
        nonceStr: {
            type: "string",
            description: "微信返回的随机字符串"
        },
        package: {
            type: "string",
            description: "统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*"
        },
        signType: {
            type: "string",
            description: "签名算法，暂支持 MD5"
        },
        timeStamp: {
            type: "integer",
            description: "当前的时间"
        },
        paySign: {
            type: "string",
            description: "签名"
        },
        codeUrl: {
            type: "string",
            description: "tradeType为NATIVE时有返回，用于生成二维码，展示给用户进行扫码支付"
        }
    },
    additionalProperties: false,
    required: ["appId", "nonceStr", "package", "signType", "timeStamp", "paySign"]
};

module.exports = {request, response};