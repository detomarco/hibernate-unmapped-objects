import { log } from "./log.utils";

export enum ErrorLevel {
    Class = "Class",
    Annotation = "Annotation",
    Filed = "Filed",
    Attribute = "Attribute",
    Property = "Property"
}

class ErrorRegister {

    registry: { [key: string]: number } = {}

    private static instance: ErrorRegister | undefined = undefined;

    private constructor() {
    }

    public static getInstance() {
        if (this.instance === undefined) {
            this.instance = new ErrorRegister();
        }
        return this.instance;
    }

    register(level: ErrorLevel) {
        this.registry[level] = this.registry[level] ?? 0;
    }

    printReport() {
        log.info("ERROR REPORT")
        Object.keys(this.registry).map(key => {
            log.info(`${key} => ${this.registry[key]}`)
        })
    }
}

export const errorRegister = ErrorRegister.getInstance()
