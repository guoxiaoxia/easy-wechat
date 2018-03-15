const mutex = require('key_mutex').mutex();
const Http = Lib.http;

const crypto = require('crypto');
const token = '';
const aesKey = '';
const appId = '';

module.exports = async (request) => {
    //获取参数
    const timestamp = request.query.timestamp;
    const nonce = request.query.nonce;
    const signature = request.query.msg_signature;
    const encryptType = request.query.encrypt_type;
    const msgEncrypt = await Common.Toolbox.asyncXmlToJson(request.rawBody);
    if (signature === undefined || timestamp === undefined || nonce === undefined || encryptType === undefined || encryptData === undefined){
        throw new Error(`signature [${signature}] timestamp [${timestamp}] nonce [${nonce}] encryptType [${encryptType}] encryptData [${encryptData}] should exist in url`);
    }

    //检查签名
    await checkSignature({signature, timestamp, nonce, token, msgEncrypt});

    //提取密文
    let decryptedMessage = _decryptXMLCustomMsgPush({msgEncrypt, aesKey, appId});

    return await new Promise((resolve, reject) => {
        convert(decryptedMessage, (err, result) => {
            resolve(restructure(result));
        });
    });
};

async function checkSignature({signature, timestamp, nonce, token, msgEncrypt}) {
    let localSignature = Lib.sign.customMessage({token, timestamp, nonce, msgEncrypt});
    if (localSignature !== signature) {
        LogicLogger.error(`localSignature[${localSignature}] not equal to signature[${signature}]`);
        throw new Error(`localSignature[${localSignature}] not equal to signature[${signature}]`);
    }
}

