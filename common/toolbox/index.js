const uuid = require('uuid/v4');

module.exports = {
    uuid: () => uuid().replace(/-/g, '').toUpperCase(),
    timeNow: () => Math.floor(new Date().getTime() / 1000),
    dateStringToTimeStamp,
    jsonToXml: require('./jsonToXml'),
    jsonToUrl: require('./jsonToUrl'),
    asyncXmlToJson: require('./asyncXmlToJson'),
};


//下划线转小驼峰
function underlineToHump(data) {
    return data.replace(/_(.{1})/g, ($1, $2) => $2.toUpperCase());
}

//日期字符串yyyyMMddHHmmss转时间戳（单位秒）
function dateStringToTimeStamp(dateString) {
    let dateArray = dateString.split('');
    dateArray.splice(4,0,'-');
    dateArray.splice(7,0,'-');
    dateArray.splice(10,0,' ');
    dateArray.splice(13,0,':');
    dateArray.splice(16,0,':');
    dateString = dateArray.join('');
    return Math.floor(new Date(dateString).getTime() / 1000);
}

