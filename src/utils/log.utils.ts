import { getEnvFile } from './fs.utils';
import { LogLevel } from '../model/model';

class Logger {

    private static logLevel = getEnvFile().logLevel;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace(message: any, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.TRACE) {
            console.log('TRACE', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(message: any, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.DEBUG) {
            console.debug('DEBUG', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(message: any, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.INFO) {
            console.info('INFO', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message: any, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.WARN) {
            console.warn('WARN', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message: any, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.ERROR) {
            console.error('ERROR', message, optionalParams);
        }
    }

}

export const log = new Logger();
