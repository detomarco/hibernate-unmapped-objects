import {getEnvFile} from "./fs.utils";
import {LogLevel} from "./model";

export class Log {

    private logLevel = getEnvFile().logLevel;

    trace(message: string) {
        if(this.logLevel >= LogLevel.TRACE) {
            console.log("TRACE", message)
        }
    }

    debug(message: string) {
        if(this.logLevel >= LogLevel.DEBUG) {
            console.debug("DEBUG", message)
        }
    }

    info(message: string) {
        if(this.logLevel >= LogLevel.INFO) {
            console.info("INFO", message)
        }
    }

    warn(message: string) {
        if(this.logLevel >= LogLevel.WARN) {
            console.warn("WARN", message)
        }
    }

    error(message: string) {
        if(this.logLevel >= LogLevel.ERROR) {
            console.error("ERROR", message)
        }
    }





}
