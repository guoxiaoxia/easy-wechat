let request = {
    type: "object",
    description: "发送模板消息",
    properties: {
        appId: {
            type: "string",
            description: "小程序唯一标识"
        },
        secret: {
            type: "string",
            description: "小程序的 app secret"
        },
        userOpenid: {
            type: "string",
            description: "接收者（用户）的 openid"
        },
        templateId: {
            type: "string",
            description: "所需下发的模板消息的id"
        },
        formId: {
            type: "string",
            description: "表单提交场景下，为 submit 事件带上的 formId；支付场景下，为本次支付的 prepay_id"
        },
        data: {
            type: "object",
            description: "模板内容，不填则下发空模板",
            patternProperties: {
                "^keyword[0-9]{1,}$": {
                    type: "object",
                    description: "变量描述",
                    properties: {
                        value: {
                            type: "string",
                            description: "展示文字"
                        },
                        color: {
                            type: "string",
                            description: "文字颜色渲染,不填默认黑色，如：#173177"
                        }
                    },
                    additionalProperties: false,
                    required: ["value"]
                }
            }
        },
        page: {
            type: "string",
            description: "点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。"
        },
        emphasisKeyword: {
            type: "string",
            description: "模板需要放大的关键词，不填则默认无放大"
        }
    },
    additionalProperties: false,
    required: ["appId", "secret", "userOpenid", "templateId", "formId", "data"]
};

let response = {
    type: "boolean",
    description: "是否发送成功"
};

module.exports = {request, response};