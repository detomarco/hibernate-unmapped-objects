import { log } from "./log.utils";

export enum ErrorLevel {
    Class = "Class",
    Annotation = "Annotation",
    Filed = "Filed",
    Attribute = "Attribute",
    Property = "Property"
}

class ErrorRegister {

    registry: { [key: string]: number } | undefined = undefined;

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
        if (this.registry === undefined) {
            this.registry = this.registry = {};
        }
        this.registry[level] = this.registry[level] ? this.registry[level] + 1 : 1;
    }


    printReport() {
        if (this.registry !== undefined) {
            console.log("\n====================")
            console.log("    ERROR REPORT")
            console.table(this.registry)
        } else {
            console.log("\nNo errors detected 🎉")
        }
    }

}

export const errorRegister = ErrorRegister.getInstance()
