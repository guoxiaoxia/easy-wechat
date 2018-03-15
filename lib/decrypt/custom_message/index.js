const crypto = require('crypto');

/**
 * aes_msg=Base64_Decode(msg_encrypt)
 * rand_msg=AES_Decrypt(aes_msg)
 * 验证尾部
 * 去掉rand_msg头部的16个随机字节，4个字节的msg_len,和尾部的
 */
module.exports = ({msgEncrypt, aesKey, appId}) => {
    let aesMsg = new Buffer(msgEncrypt, 'base64');




    aesKey = new Buffer(aesKey + '=', 'base64');
    let iv = aesKey.slice(0, 16);
    let aesCipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    aesCipher.setAutoPadding(false);
    let decoded = aesCipher.update(str, 'base64');
    decoded += aesCipher.final();

    let decipheredBuff = Buffer.concat([, ]);
    decipheredBuff = _PKCS7Decoder(decipheredBuff);
    let lenNetOrderCorpid = decipheredBuff.slice(16);
    let msgLen = lenNetOrderCorpid.slice(0, 4).readUInt32BE(0);
    let result = lenNetOrderCorpid.slice(4, msgLen + 4).toString();
    let appId = lenNetOrderCorpid.slice(msgLen + 4).toString();
    if (appId !== ourAppId) {
        throw new Error('appId is invalid');
    }
    return result;
};
