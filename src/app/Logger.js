import winston from "winston";
import path from 'path';


export default class Logger {
    constructor({level = 'debug', logDir = '.data'} = {}) {
        this.logger = winston.createLogger({
            level: level,
            format: winston.format.json(),
            transports: [
                /**
                 * Write errors to error.log.
                 * Write all logs to combined.log.
                 */
                new winston.transports.File({filename: path.join(logDir, 'error.log'), level: 'error'}),
                new winston.transports.File({filename: path.join(logDir, 'combined.log')})
            ]
        });
    }

    setLevel(level) { this.logger.level = level.toLowerCase() }

    getLevel() { return this.logger.level }

    setName(name) {} // No utility for now.

    debug(messages) {
        console.log('hi there');
        this.logger.debug(messages);
    }

    info(messages) { this.logger.info(messages) }

    warn(messages) { this.logger.warn(messages) }

    error(messages) { this.logger.error(messages) }
}