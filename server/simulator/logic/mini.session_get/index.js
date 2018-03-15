module.exports = async(request) => {
    return {
        openId: request.code,
        sessionKey: new Buffer('fake_session_key').toString('base64')
    };
};
