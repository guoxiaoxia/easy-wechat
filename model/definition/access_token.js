module.exports={
    appIdAndSecret: {
        type: 'string',
        length: 128,
        default: '',
        index: 'unique'
    },
    accessToken: {
        type: 'string',
        length: 512,
        default: ''
    },
    modifiedTime: {
        type: 'integer',
        default: 0
    }
};