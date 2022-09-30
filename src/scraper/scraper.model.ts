import { MapString } from "../model/model";

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

export interface JavaClassScraper {
    filePath: string,
    name: string | undefined,
    annotations: AnnotationScraper[],
    properties: ClassPropertyScraper[]
}

export interface ClassPropertyScraper {
    property: string;
    annotations: AnnotationScraper[]
}

export interface AnnotationScraper {
    name: string,
    attributes: MapString
}
