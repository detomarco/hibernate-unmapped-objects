import { MapString } from "../model/model";

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
