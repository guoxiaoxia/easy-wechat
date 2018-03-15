module.exports = async(request) => {
    let order = undefined;
    if (request.hasOwnProperty('orderId')) {
        order = await getOrderById(request.orderId)
    }
    else if(request.hasOwnProperty('wechatOrderId')) {
        order = await getOrderByWechatOrderId(request.wechatOrderId)
    }else{
        throw new Error('can not query order without order id either wechat order id');
    }

    let response = {
        tradeState: order.status
    };

    if (order.status === Common.Constant.Payment.Status.PAID) {
        Object.assign(response, {
            totalFee: order.orderPrice,
            timeEnd: order.paidTime,
            isSubscribe: false
        })
    }

    return response;
};


async function getOrderById(orderId) {
    const [{fake_order}] = await SmartModel.select('fake_order')
        .where(SmartModel.Logic.statement('orderId', '=', orderId))
        .run();

    return fake_order;
}

async function getOrderByWechatOrderId(wehcatOrderId) {
    const [{fake_order}] = await SmartModel.select('fake_order')
        .where(SmartModel.Logic.statement('wechatOrderId', '=', wehcatOrderId))
        .run();

    return order;
}
