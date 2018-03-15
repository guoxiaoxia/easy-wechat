let response = {
    type: "object",
    description: "用户登录回调通知接口",
    properties: {
        code: {
            type: "string",
            description: "用户登录凭证（有效期五分钟）"
        }
    },
    additionalProperties: false,
    required: ["code"]
};

module.exports = {response};