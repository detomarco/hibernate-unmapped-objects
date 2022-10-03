export enum ErrorLevel {
    Class = 'Class',
    Annotation = 'Annotation',
    Attribute = 'Attribute',
    Property = 'Property'
}

class ErrorRegister {

    registry: Record<string, number> | undefined = undefined;

    private static instance: ErrorRegister | undefined = undefined;

    private constructor() {
        // private
    }

    public static getInstance(): ErrorRegister {
        if (this.instance === undefined) {
            this.instance = new ErrorRegister();
        }
        return this.instance;
    }

    register(level: ErrorLevel): void {
        if (this.registry === undefined) {
            this.registry = this.registry = {};
        }
        this.registry[level] = this.registry[level] ? this.registry[level] + 1 : 1;
    }

    printReport(): boolean {
        if (this.registry !== undefined) {
            console.log('\n====================');
            console.log('    ERROR REPORT');
            console.table(this.registry);
            return true;
        } else {
            console.log('\nNo errors detected 🎉');
            return false;
        }
    }

}

export const errorRegister = ErrorRegister.getInstance();
