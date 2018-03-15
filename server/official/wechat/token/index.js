let crypto = require('crypto');
let url = require('url');

module.exports = function(request){
    let query = url.parse(request.url,true).query;
    let signature = query.signature;
    let timestamp = query.timestamp;
    let nonce = query.nonce;
    let echostr = query.echostr;

    if(check(timestamp,nonce,signature,"goodgoodstudy")){
        return echostr;
    }else{
        throw new Error("It is not from weixin");
    }
};

function check(timestamp,nonce,signature,token){
    let currSign,tmp;
    tmp = [token,timestamp,nonce].sort().join("");
    currSign = crypto.createHash("sha1").update(tmp).digest("hex");
    return (currSign === signature);
}