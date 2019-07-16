require('winston-papertrail').Papertrail;

let winston = require('winston');
let pjson = require('./package.json');
let path = require('path');
const PROJECT_ROOT = path.join(__dirname, '..');

let consoleOptions = {
    colorize: true,
    level: 'debug',
    timestamp: function() {
        return new Date().toString();
    }
};

let papertrailOptions = {
    host: 'SOME_HOST',
    level: 'debug',
    port: 12345
};

if (process.env.NODE_ENV === 'local') {
    consoleOptions.level = 'debug';
    papertrailOptions = null;
}

let consoleLogger = (!!consoleOptions) && new winston.transports.Console(consoleOptions);
let paperLogger = (!!papertrailOptions) && new winston.transports.Papertrail(papertrailOptions);

let logger = winston.createLogger({
    transports: [consoleLogger, paperLogger].filter(value => !!value)
});



module.exports.info = function() {
    logger.info.apply(logger, formatLogArguments(arguments));
}

module.exports.warn = function() {
    logger.warn.apply(logger, formatLogArguments(arguments));
}

module.exports.debug = function() {
    logger.debug.apply(logger, formatLogArguments(arguments));
}

module.exports.verbose = function() {
    logger.verbose.apply(logger, formatLogArguments(arguments));
}

module.exports.error = function() {
    logger.error.apply(logger, formatLogArguments(arguments));
}

function formatLogArguments(args) {
    args = Array.prototype.slice.call(args);
    let stackInfo = getStackinfo(1);
    if(stackInfo) {
        let calleeStr = `(${stackInfo.relativePath}: ${stackInfo.line})`
        if(typeof args[0] === 'string') {
            args[0] = args[0] + ' ' + calleeStr
        } else {
            args.unshift(calleeStr);
        }
    }
    return args;
}

function getStackinfo(stackIndex) {
    let stacklist = (new Error()).stack.split('\n').slice(3)


    let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
    let stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

    let s = stacklist[stackIndex] || stacklist[0]
    let sp = stackReg.exec(s) || stackReg2.exec(s)

    if(sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative(PROJECT_ROOT, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack:stacklist.join('\n')
        }
    }
}