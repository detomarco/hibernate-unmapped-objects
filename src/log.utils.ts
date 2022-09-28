import {getEnvFile} from "./fs.utils";
import {LogLevel} from "./model";

export class Logger {

    private static logLevel = getEnvFile().logLevel;

    trace(message: string) {
        if(Logger.logLevel >= LogLevel.TRACE) {
            console.log("TRACE", message)
        }
    }

    debug(message: string) {
        if(Logger.logLevel >= LogLevel.DEBUG) {
            console.debug("DEBUG", message)
        }
    }

    info(message: string) {
        if(Logger.logLevel >= LogLevel.INFO) {
            console.info("INFO", message)
        }
    }

    warn(message: string) {
        if(Logger.logLevel >= LogLevel.WARN) {
            console.warn("WARN", message)
        }
    }

    error(message: string) {
        if(Logger.logLevel >= LogLevel.ERROR) {
            console.error("ERROR", message)
        }
    }

}
