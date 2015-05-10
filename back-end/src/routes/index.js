'use strict';
exports.attachHandlers = function attachHandlers(app) {
    app.get('/', function (req, res) {
      console.log(req.query);
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send('OK');
    });
    app.post('/youtube-upload', function (req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(req.body.url);
    })
};
