const Http = Lib.http;

module.exports = async(request) => {
    let response = await send(generateRequest(request));
    return generateResponse(response);
};

function generateRequest(request) {
    return {
        appid : request.appId,
        secret : request.secret,
        js_code : request.code,
        grant_type : "authorization_code"
    };
}

function generateResponse(response) {
    return {
        openId: response.openid,
        sessionKey: response.session_key,
        unionId: response.unionid
    };
}

async function send(request) {
    return JSON.parse(await (new Http()).wechatAjax(
        new Http.Request.Get(`https://api.weixin.qq.com/sns/jscode2session?${Common.Toolbox.jsonToUrl(request)}`)
    ));
}