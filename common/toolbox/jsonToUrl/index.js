module.exports = (jsonData) => {
    let paramsArr = [];
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key) && jsonData[key] !== '' && jsonData[key] !== undefined) {
            paramsArr.push(`${key}=${jsonData[key]}`)
        }
    }
    return paramsArr.join('&');
};



