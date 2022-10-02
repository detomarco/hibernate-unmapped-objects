
export type MapString = { [key: string]: string }

export interface PrinterProperties {
    ignoreTables: string[],
    ignoreColumns: string[]
}

export interface ConfigProperties {
    logLevel: LogLevel,
    showStacktrace: boolean
    entitiesFolderPath: string,
    printer: PrinterProperties
    db: DbProperties
}
export type SupportedDb = 'mysql';
export interface DbProperties {
    type: SupportedDb
    host: string,
    user: string,
    password: string,
    schema: string,
    port: number
}

export enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE
}
