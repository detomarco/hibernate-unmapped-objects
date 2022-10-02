
export type MapString = { [key: string]: string }

export interface ConfigProperties {
    logLevel: LogLevel,
    showStacktrace: boolean
    entitiesFolderPath: string,
    ignoreTables: string[],
    ignoreColumns: string[]
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

export type LogLevelString = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE
}
