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

    // attach route handlers
    routes.attachHandlers(server);
    return server;
};


