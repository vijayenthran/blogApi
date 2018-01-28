'use strict';

let config = {
    databaseConnection: 'mongodb://localhost/Blog',
    serverPort : 3000
};


module.exports = {
    databaseUrl: process.env.databaseUrl || global.databaseUrl || config.databaseConnection,
    port: process.env.PORT || config.serverPort,
    testdatabaseURl: process.env.testdatabaseURl || 'mongodb://vijayjs2208:vijayjs2208@ds115768.mlab.com:15768/blog' || 'mongodb://localhost/test-Blog'
};
