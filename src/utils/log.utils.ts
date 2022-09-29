import { env } from './fs.utils';
import { LogLevel } from '../model/model';

class Logger {

    private static logLevel = env.logLevel;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace(message: string, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.TRACE) {
            console.log('TRACE', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(message: string, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.DEBUG) {
            console.debug('DEBUG', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(message: string, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.INFO) {
            console.info('INFO', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message: string, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.WARN) {
            console.warn('WARN', message, optionalParams);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message: string, ...optionalParams: any[]): void {
        if(Logger.logLevel >= LogLevel.ERROR) {
            console.error('ERROR', message, optionalParams);
        }
    }

}

export const log = new Logger();
