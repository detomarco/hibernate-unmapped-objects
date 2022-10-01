
export type MapString = { [key: string]: string }

export interface EnvProperties {
    logLevel: LogLevel,
    entitiesFolderPath: string,
    db: DbProperties | undefined
}
export type SupportedDb = 'mysql';
export interface DbProperties {
    type: SupportedDb
    host: string,
    user: string,
    password: string,
    information_schema: string,
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
