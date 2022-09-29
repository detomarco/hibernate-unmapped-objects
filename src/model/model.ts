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

export interface Table {
    filePath: string,
    name: string,
    annotations: Annotation[],
    properties: ClassProperty[]
}

export interface ClassProperty {
    name: string;
    annotations: Annotation[]
}

export interface Annotation {
    name: string,
    attributes : {
        name: string,
        value: string
    }[]
}
