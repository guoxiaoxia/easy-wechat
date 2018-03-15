require(`${__dirname}/../../../../../env.js`);
const inquirer = require('inquirer');
const Crawler =  require('webagent');

module.exports = async () => {
    const answers = await inquirer.prompt([
        {
            name: 'orderId',
            message: '输入订单号:',
            type:'autocomplete',
            source: async (answersSoFar, input) => {
                let unpaidOrderList = await SmartModel.select('fake_order')
                    .where(SmartModel.Logic.statement('status', '=', Common.Constant.Payment.Status.UNPAID))
                    .run();
                let unpaidOrderIdList = unpaidOrderList.map(({fake_order: order}) => order.orderId);

                if (input === null) {
                    return unpaidOrderIdList;
                }
                return unpaidOrderIdList.filter(orderId => orderId.startsWith(input));
            }
        },
    ]);

    const [{fake_order: order}] = await SmartModel.select('fake_order')
        .where(SmartModel.Logic.statement('orderId', '=', answers.orderId))
        .run();

    if (order === undefined) {
        throw new Error('该订单不存在'+answers.orderId+a)
    }

    let timeNow = Common.Toolbox.timeNow();
    await SmartModel.update('fake_order')
        .data({
            status: Common.Constant.Payment.Status.PAID,
            paidTime: timeNow
        })
        .where(SmartModel.Logic.statement('orderId', '=', answers.orderId))
        .run();

    let response = {
        orderId: order.orderId,
        wechatTransactionId: order.wechatOrderId,
        orderPrice: order.orderPrice,
        isSubscribe: false,
        finishedTime: timeNow
    };

    Lib.schemaCheck(require(`${SCHEMA_DIR}/wechat_callback/mini.payment_notify`).response, response);
    console.log(JSON.stringify(response));
    await _ajax(
        new Crawler.Request.Post(order.notifyUrl).setJsonBody({request: response})
    );
};

async function _ajax(request){
    let crawler = new Crawler();
    let response = await crawler.ajax(request);
    if (response.status !== 200) {
        throw new Error(`error response status [${response.status}]`);
    }
    return response.textBody;
}