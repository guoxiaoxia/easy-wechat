const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-keywords')(ajv,'switch');

module.exports = (schema, data) => {
    if (!ajv.validate(schema, data)){
        throw new Error(`invalid data:${JSON.stringify(data)}\n schema:${JSON.stringify(schema)}\n ${ajv.errorsText()}`);
    }
};

