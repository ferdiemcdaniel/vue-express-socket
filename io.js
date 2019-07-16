const logger = require('./logger');
const sio = require('socket.io');

let io = null;

exports.initialize = function(server) {
    io = sio(server);
}

exports.io = function() {
    return io;
}