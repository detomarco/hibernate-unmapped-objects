
export interface JavaClassScraper {
    filePath: string,
    name: string | undefined,
    annotations: AnnotationScraper[],
    properties: ClassPropertyScraper[]
}

export interface ClassPropertyScraper {
    property: string | undefined;
    annotations: AnnotationScraper[]
}

export interface AnnotationScraper {
    name: string,
    attributes: AnnotationAttribute
}

export interface AnnotationAttribute{

}
