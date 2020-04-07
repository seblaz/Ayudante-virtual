import winston from "winston";
import rotating from 'winston-daily-rotate-file';


export default class Logger {
    constructor({level = 'debug', logDir = '.data'} = {}) {
        const transportOptions = {
            dirname: logDir,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '14'
        };

        this.logger = winston.createLogger({
            level: level,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            transports: [
                /**
                 * Write errors to error.log.
                 * Write all logs to combined.log.
                 */
                new winston.transports.Console({
                    format: winston.format.cli()
                }),
                new (winston.transports.DailyRotateFile)({
                    level: 'error',
                    filename: 'error-%DATE%.log',
                    ...transportOptions
                }),
                new (winston.transports.DailyRotateFile)({
                    filename: 'combined-%DATE%.log',
                    ...transportOptions
                })
            ]
        });
    }

    setLevel(level) {
        this.logger.level = level.toLowerCase()
    }

    getLevel() {
        return this.logger.level
    }

    setName(name) {
    } // No real use for now.

    debug(messages) {
        this.logger.debug(messages)
    }

    info(messages) {
        this.logger.info(messages)
    }

    warn(messages) {
        this.logger.warn(messages)
    }

    error(messages) {
        this.logger.error(messages)
    }
}