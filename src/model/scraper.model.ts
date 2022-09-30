export type MapString = { [key: string]: string }

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

export interface JavaClass {
    filePath: string,
    name: string | undefined,
    annotations: Annotation[],
    properties: ClassProperty[]
}

export interface ClassProperty {
    property: string | undefined;
    annotations: Annotation[]
}

export interface Annotation {
    name: string | undefined,
    attributes: MapString
}
