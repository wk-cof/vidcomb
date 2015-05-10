'use strict';

var express = require('express'),
    routes = require('./routes'),
    bodyParser = require('body-parser');

exports.createServer = function createServer() {
    var server = express();

    // attach middleware
    server.use(bodyParser.urlencoded({
        extended: true // so it stops complaining about urlencoded being deprecated
    }));
    server.use(bodyParser.json());  // to support JSON-encoded bodies
    //server.use(express.static(path.join(__dirname, 'public')));
    //var allowCrossDomain = function(req, res, next) {
    //    res.header('Access-Control-Allow-Origin', '*');
    //        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //
    //                // intercept OPTIONS method
    //                    if ('OPTIONS' == req.method) {}}

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
          res.send(200);
        }
        else {
          next();
        }
    };
    server.use(allowCrossDomain);
    // attach route handlers
    routes.attachHandlers(server);
    return server;
};


