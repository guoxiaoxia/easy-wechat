let request = {
    oneOf: [
        {
            type: "object",
            description: "发送客服消息-文本消息",
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
                msgType: {
                    type: "string",
                    enum: [Common.Constant.MsgType.TEXT],
                    description: "消息类型"
                },
                text: {
                    type: "object",
                    properties: {
                        content: {
                            type: "string",
                            description: "文本消息内容"
                        }
                    }
                }
            },
            additionalProperties: false,
            required: ["appId", "secret", "userOpenid", "msgType", "text"]
        },
        {
            type: "object",
            description: "发送客服消息-图文链接",
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
                msgType: {
                    type: "string",
                    enum: [Common.Constant.MsgType.LINK],
                    description: "消息类型"
                },
                link: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "消息标题"
                        },
                        description: {
                            type: "string",
                            description: "图文链接消息"
                        },
                        url: {
                            type: "string",
                            description: "图文链接消息被点击后跳转的链接"
                        },
                        thumbUrl: {
                            type: "string",
                            description: "图文链接"
                        }
                    },
                    additionalProperties: false,
                    required: ["title", "description", "url", "thumbUrl"]
                }
            },
            additionalProperties: false,
            required: ["appId", "secret", "userOpenid", "msgType", "link"]
        }
    ]
};

let response = {
    type: "boolean",
    description: "是否发送成功"
};

module.exports = {request, response};