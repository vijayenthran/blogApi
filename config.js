'use strict';

let config = {
    databaseConnection: 'mongodb://localhost/Blog',
    serverPort : 3000
};


module.exports = {
    databaseUrl: process.env.databaseUrl || global.databaseUrl || config.databaseConnection,
    port: process.env.PORT || config.serverPort
};
