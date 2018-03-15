const xml = require('xml');

module.exports = (json) => {
    return xml(jsonToJsonArr(json, []))
};

function jsonToJsonArr(json, jsonArr){
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            let value = isObject(json[key]) ? jsonToJsonArr(json[key], []) : json[key];
            jsonArr.push( {[key] : value} );
        }
    }
    return jsonArr;
}

function isObject(value) {
    return (typeof value === 'object') && (!(value instanceof Array))
}

