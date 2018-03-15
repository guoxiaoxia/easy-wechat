const mutex = require('key_mutex').mutex();
const Http = Lib.http;

module.exports = async (request) => {
    request = await Common.Toolbox.asyncXmlToJson(request.rawBody);

    if (request.hasOwnProperty('return_code') && request.return_code === 'SUCCESS'){
        //数据锁
        await mutex.lock(request.transaction_id, async () => {
            const order = await getOrder(request.out_trade_no);

            //签名验证
            if(!isSignTrue(request, order.paymentKey)){
                return Common.Toolbox.jsonToXml({
                    xml: {
                        return_code: "FAIL",
                        return_msg: "验签失败"
                    }
                })
            }

            if (order === undefined) {
                return Common.Toolbox.jsonToXml({
                    xml: {
                        return_code: "FAIL",
                        return_msg: "订单不存在"
                    }
                })
            }

            //检查业务状态，处理过直接返回结果成功
            if(order.status === Common.Constant.Payment.Status.PAID){
                return Common.Toolbox.jsonToXml({
                    xml: {
                        return_code: "SUCCESS",
                        return_msg: "OK"
                    }
                })
            }

            //订单金额是否与商户侧的订单金额一致
            if(!isCorrect(order, request)){
                return Common.Toolbox.jsonToXml({
                    xml: {
                        return_code: "FAIL",
                        return_msg: "逻辑错误"
                    }
                })
            }

            await deal(order, request);
        });
        return Common.Toolbox.jsonToXml({
            xml: {
                return_code: "SUCCESS",
                return_msg: "OK"
            }
        })
    }
    else {
        return Common.Toolbox.jsonToXml({
            xml: {
                return_code: "FAIL",
                return_msg: "失败"
            }
        })
    }
};

function isSignTrue(request, key) {
    let signRequest = Object.assign({},request);
    delete signRequest.sign;
    let sign = Lib.sign.payment({
        jsonData: signRequest,
        key: key,
        signType: Common.Constant.SignType.MD5
    });

    return sign === request.sign
}

async function getOrder(orderId) {
    const [{order}] = await SmartModel.select('order')
        .where(SmartModel.Logic.statement('orderId', '=', orderId))
        .run();

    return order;
}

async function isCorrect(order, request) {
    if (order.status !== Common.Constant.Payment.Status.UNPAID){
        return false;
    }

    return order.orderPrice === request.total_fee;
}

/**
 * 修改订单状态
 * 通知回调
 */
async function deal(order, request) {

    await SmartModel.update('order')
        .data({
            status: Common.Constant.Payment.Status.PAID
        })
        .where(SmartModel.Logic.statement('orderId', '=', order.orderId))
        .run();

    let response = {
        orderId: request.out_trade_no,
        wechatTransactionId: request.transaction_id,
        orderPrice: request.total_fee,
        isSubscribe: request.is_subscribe === 'Y',
        finishedTime: Common.Toolbox.dateStringToTimeStamp(request.time_end)
    };

    Lib.schemaCheck(require(`${SCHEMA_DIR}/wechat_callback/mini.payment_notify`).response, response);
    await (new Http()).apiAjax(
        new Http.Request.Post(order.notifyUrl).setJsonBody({request: response})
    );
}