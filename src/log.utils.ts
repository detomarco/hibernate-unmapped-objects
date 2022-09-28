import {env} from "./fs.utils";
import {LogLevel} from "./model";

class Logger {

    private static logLevel = env.logLevel;

    trace(message: string, ...optionalParams: any[]) {
        if(Logger.logLevel >= LogLevel.TRACE) {
            console.log("TRACE", message, optionalParams)
        }
    }

    debug(message: string, ...optionalParams: any[]) {
        if(Logger.logLevel >= LogLevel.DEBUG) {
            console.debug("DEBUG", message, optionalParams)
        }
    }

    info(message: string, ...optionalParams: any[]) {
        if(Logger.logLevel >= LogLevel.INFO) {
            console.info("INFO", message, optionalParams)
        }
    }

    warn(message: string, ...optionalParams: any[]) {
        if(Logger.logLevel >= LogLevel.WARN) {
            console.warn("WARN", message, optionalParams)
        }
    }

    error(message: string, ...optionalParams: any[]) {
        if(Logger.logLevel >= LogLevel.ERROR) {
            console.error("ERROR", message, optionalParams)
        }
    }

}

export const log = new Logger()
