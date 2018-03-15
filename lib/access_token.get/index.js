const Http = require('../http');

/**
 * 如果对应{appId, secret}已有在维护中的accessToken，直接返回
 * 如果没有，新建一个accessToken，并定时刷新
 * @param appId
 * @param secret
 * @returns {Promise.<*>}
 */
module.exports = async ({appId, secret}) => {
    const [token] = await SmartModel.select('access_token')
        .where(SmartModel.Logic.statement('appIdAndSecret', '=', `${appId}_${secret}`))
        .run();

    if (token !== undefined) {
        return token.accessToken;
    }

    return await _newAccessToken({appId, secret});
};

async function _newAccessToken({appId, secret}) {
    Logger.info(`new access token with appId ${appId} and secret ${secret}`);
    const {accessToken, expiresIn} = await _getAccessToken({appId, secret});

    setInterval(async () => {
        await _updateAccessToken({appId,secret})
    }, (expiresIn - 20) * 1000);

    return accessToken;
}

async function _updateAccessToken({appId,secret}) {
    let {accessToken} = await _getAccessToken({appId,secret});

    await SmartModel.update('access_token')
        .data({
            accessToken: accessToken,
            modifiedTime: Common.Toolbox.timeNow()
        })
        .where(SmartModel.Logic.statement('appIdAndSecret', '=', `${appId}_${secret}`))
        .run();
}

async function _getAccessToken({appId,secret}) {
    let response = JSON.parse(await (new Http()).wechatAjax(
        new Http.Request.Get(`https://api.weixin.qq.com/cgi-bin/token?${Common.Toolbox.jsonToUrl({
            appid : appId,
            secret : secret,
            grant_type : "client_credential"
        })}`)
    ));

    if (!response.hasOwnProperty('access_token')) {
        throw new Error(`get access token fail with appid ${appId} and secret ${secret}`);
    }

    return {
        accessToken: response.access_token,
        expiresIn: response.expires_in
    };
}