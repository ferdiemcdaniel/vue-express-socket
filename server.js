const dotenv = require('dotenv').config({
    path: 'variables.env'
});
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('./io').initialize(http);
const global_socket = require('./io').io();
const logger = require('./logger');
const path = require('path');
const pjson = require('./package.json');
const port = process.env.PORT || 8500;

app.use(express.static(path.join(__dirname,'public')));

http.listen(port);

logger.info(`${pjson.name} Server Started >>`);
logger.info(`running in ${process.env.NODE_ENV}`);
logger.info(`running on port ${port}`);

setInterval(function() {
    global_socket.emit('PULSE', heartbeat())
}, 1300)

function heartbeat() {
    const pulse = Math.ceil(Math.random() * (160 - 60) + 60);
    logger.debug(`Heartbeat ${pulse}`);
    return pulse;
}