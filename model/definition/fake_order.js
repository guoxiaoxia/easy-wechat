module.exports={
    orderId: {
        type: 'string',
        length: 32,
        default: '',
        index: 'unique'
    },
    wechatOrderId: {
        type: 'string',
        length: 64,
        default: '',
    },
    orderPrice: {
        type: 'integer',
        default: 0
    },
    tradeType: {
        type: 'string',
        length: 32,
        default: '',
    },
    notifyUrl: {
        type: 'string',
        length: 256,
        default: '',
    },
    paidTime:{
        type: 'integer',
        default: 0
    },
    status: {
        type: 'integer',
        default: 0,
        index: 'ordinary'
    }
};