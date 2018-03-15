const Http = Lib.http;

module.exports = async(request) => {
    let response = await send({
        accessToken: await Lib.getAccessToken({appId: request.appId, secret: request.secret}),
        request: generateRequest(request)
    });
    return generateResponse(response);
};

function generateRequest(request) {
    return {
        touser : request.userOpenid,
        template_id : request.templateId,
        form_id : request.formId,
        data : request.data,
        page: request.page,
        emphasis_keyword: request.emphasisKeyword
    };
}

function generateResponse(response) {
    return response.errcode === 0;
}

async function send({accessToken, request}) {
    return JSON.parse(await (new Http()).wechatAjax(
        new Http.Request.Post(`https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${accessToken}`).setJsonBody(request)
    ));
}