require('../env');
const http = require("http");

module.exports = class {
    constructor(host, port) {
        this._host = host;
        this._port = port;
    }
    async miniSessionGet(request) {
        const response = await this._send('/mini.session_get', JSON.stringify(request));
        return JSON.parse(response);
    }

    async miniOrderQuery(request) {
        const response = await this._send('/mini.order.query', JSON.stringify(request));
        return JSON.parse(response);
    }

    async miniOrderSubmit(request) {
        const response = await this._send('/mini.order.submit', JSON.stringify(request));
        return JSON.parse(response);
    }

    async miniCustomMessageSend(request) {
        const response = await this._send('/mini.custom_message_send', JSON.stringify(request));
        return JSON.parse(response);
    }

    async miniTemplateMessageSend(request) {
        const response = await this._send('/mini.template_message_send', JSON.stringify(request));
        return JSON.parse(response);
    }

    _send(path, request, timeout = 30000) {
        return new Promise((resolve, reject) => {
            let options = {
                method: "POST",
                hostname: this._host,
                port: this._port,
                path: path,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.from(request).length
                }
            };

            let data = [];
            let req = http.request(options, response => {
                response.on("data", chunk => data.push(chunk));
                response.on("end", () => {
                    if (response.statusCode === 200) {
                        resolve(Buffer.concat(data));
                    }
                    else {
                        reject(new Error('bad http response status = ' + response.statusCode));
                    }
                });
            });
            req.on('socket', function (socket) {
                socket.setTimeout(timeout);
                socket.on('timeout', function() {
                    req.abort();
                });
            });
            req.on("error", err => reject(err));

            req.write(request);
            req.end();
        });
    }
};