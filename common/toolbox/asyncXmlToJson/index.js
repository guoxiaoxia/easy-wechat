const xml2js = require('xml2js').parseString;
const xml2jsConfig = {
    explicitArray : false,//只有存在多个数组时才创建数组
    ignoreAttrs : true //忽略所有XML属性并仅创建文本节点
};

module.exports = function xmlToJson(xmlData){
    return new Promise((resolve, reject)=>{
        xml2js( xmlData, xml2jsConfig, (error, result)=>{
            if(error !== null){
                Logger.error(error);
                return reject(error);
            }
            else {
                return resolve(result.xml);
            }
        })
    });
};



