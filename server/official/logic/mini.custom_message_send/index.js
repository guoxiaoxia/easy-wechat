const Http = Lib.http;

module.exports = async(request) => {
    let response = await send({
        accessToken: await Lib.getAccessToken({appId: request.appId, secret: request.secret}),
        request: generateRequest(request)
    });
    console.log(JSON.stringify(response));
    return generateResponse(response);
};

function generateRequest(request) {
    let wechatRequest = {
        touser : request.userOpenid,
        msgtype : request.msgType
    };

    switch (request.msgType){
        case Common.Constant.MsgType.TEXT:
            wechatRequest.text = request.text; break;
        case Common.Constant.MsgType.LINK:
            wechatRequest.link = request.link; break;
        default:
            throw new Error(`not supported this message type ${request.msgType}`)
    }

    return wechatRequest;
}

function generateResponse(response) {
    return response === 0;
}

async function send({accessToken, request}) {
    return JSON.parse(await (new Http()).wechatAjax(
        new Http.Request.Post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`).setJsonBody(request)
    ));
}