const crypto = require('crypto');

module.exports = ({jsonData, key, signType}) => {
    /**
     * 非空参数
     * 按照key=value的格式
     * 按照参数名ASCII字典序排序
     * "appid=wxd930ea5d5a258f4f&mch_id=10000100"
     */
    let paramsArr = [];
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key) && jsonData[key] !== '' && jsonData[key] !== undefined) {
            paramsArr.push(`${key}=${jsonData[key]}`)
        }
    }
    let targetText = paramsArr.sort().join('&');

    //拼接API密钥
    targetText += "&key=" + key;

    //签名方式
    switch (signType) {
        case Common.Constant.SignType.MD5:
            return crypto.createHash('md5').update(targetText).digest('hex').toUpperCase();
        case Common.Constant.SignType.SHA256:
            return crypto.createHmac('sha256', key).update(targetText).digest('hex');
        default:
            throw new Error(`can not support sign type : ${signType}`)
    }
};

