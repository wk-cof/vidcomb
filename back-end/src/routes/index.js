'use strict';
exports.attachHandlers = function attachHandlers(app) {
    app.get('/', function (req, res) {
        res.status(200).send('OK');
    });
    app.post('/youtube-upload', function (req, res) {
        res.status(200).send(req.body.url);
    })
};