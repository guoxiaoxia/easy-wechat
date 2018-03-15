let request = {
    type: "object",
    description: "使用登录凭证 code 获取 session_key 和 openid",
    properties: {
        appId: {
            type: "string",
            description: "小程序唯一标识"
        },
        secret: {
            type: "string",
            description: "小程序的 app secret"
        },
        code: {
            type: "string",
            description: "登录凭证 code"
        }
    },
    additionalProperties: false,
    required: ["appId", "secret", "code"]
};

let response = {
    type: "object",
    description: "",
    properties: {
        openId: {
            type: "string",
            description: "用户唯一标识"
        },
        sessionKey: {
            type: "string",
            description: "会话密钥"
        },
        unionId: {
            type: "string",
            description: "用户在开放平台的唯一标识符。本字段在满足一定条件的情况下才返回。"
        }
    },
    additionalProperties: false,
    required: ["openId", "sessionKey"]
};

module.exports = {request, response};