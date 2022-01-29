const {createLogger, format, transports } = require('winston');
const {combine, timestamp, printf, align, colorize} = format
const appRoot = require('app-root-path');


var options = {
    file: {
        level : process.env.LOG_LEVEL || 'info',
        filename : `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json : true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize : false
    },
    console : {
        level: process.env.LOG_LEVEL || 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

var logger = new createLogger({
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false,
    level: 'debug',
    format: combine(
        colorize({all: true}),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        )
});

logger.info("Connected successfully to Winston")

module.exports = logger;




