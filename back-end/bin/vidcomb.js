'use strict';
var server = require('../src/server').createServer(),
    port =  process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Environment: ' + server.settings.env);
    console.log('Express server listening on port ' + port);
});

