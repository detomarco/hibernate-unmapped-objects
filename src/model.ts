export interface EnvProperties {
    logLevel: LogLevel,
    entitiesFolderPath: string
}

export type LogLevelString = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE
}
