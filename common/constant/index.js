module.exports = {
    Payment: {
        TradeType: {
            JSAPI:'JSAPI',//公众号支付
            NATIVE:'NATIVE',//原生扫码支付
            APP:'APP',//app支付
            MICROPAY:'MICROPAY'//刷卡支付
        },
        TradeStatus:{
            SUCCESS: 0,
            NOTPAY: 1,
        },
        Status: {
            PAID: 0,
            UNPAID: 1,
            TIME_OUT: 2
        },
        BillCreateIp: "127.0.0.1",
        FeeType: 'CNY',//标价币种
        MINI_LOGIN_NOTIFY_URL : '/callback/mini.login_notify',
        MINI_PAYMENT_NOTIFY_URL : '/callback/mini.payment_notify'
    },
    SignType: {
        MD5: "MD5",
        SHA256: "HMAC-SHA256"
    },
    MsgType: {
        TEXT: 'text',
        LINK: 'link'
    }
};