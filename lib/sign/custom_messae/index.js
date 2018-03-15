const crypto = require('crypto');

/**
 *sha1(sort(Token、timestamp、nonce, msg_encrypt))
 */
module.exports = ({token, timestamp, nonce, msgEncrypt}) => {
    let targetText = [token, timestamp, nonce, msgEncrypt].sort().join('');

    return crypto.createHash('sha1').update(targetText).digest('hex');
};

