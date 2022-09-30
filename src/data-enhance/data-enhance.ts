import { AnnotationScraper, ClassPropertyScraper, JavaClassScraper } from "../scraper/scraper.model";
import {
    AnnotationAttributeEnhance,
    AnnotationEnhance,
    AnnotationType,
    AnnotationTypeString,
    JavaColumn,
    JavaTable,
    NameAttributeEnhance
} from "./data-enhace.model";

const enhanceAnnotation = (annotation: AnnotationScraper): AnnotationEnhance => {
    let attributes: AnnotationAttributeEnhance | undefined = undefined;
    switch (annotation.name) {
        case 'JoinColumn':
        case 'Column':
        case 'Entity':
        case 'Table':
            attributes = new NameAttributeEnhance(annotation.attributes)

    }

    return {
        ...annotation,
        name: AnnotationType[annotation.name as AnnotationTypeString],
        attributes
    };
}

const extractNameFromAnnotations = (annotations: AnnotationEnhance[]): string | undefined => {
    for (const annotation of annotations) {
        switch (annotation.name) {
            case AnnotationType.Column:
            case AnnotationType.JoinColumn:
            case AnnotationType.Entity:
            case AnnotationType.Table:
                return (annotation.attributes as NameAttributeEnhance).default ??
                    (annotation.attributes as NameAttributeEnhance).name
        }
    }

    return undefined
}

const enhanceProperties = (property: ClassPropertyScraper): JavaColumn => {
    const annotations = property.annotations.map(it => enhanceAnnotation(it))

    return {
        column: extractNameFromAnnotations(annotations) ?? property.property,
    };
}

export const enhanceJavaClass = (javaClass: JavaClassScraper): JavaTable => {
    const annotations = javaClass.annotations.map(it => enhanceAnnotation(it))
    return {
        ...javaClass,
        name: extractNameFromAnnotations(annotations) ?? javaClass.name,
        columns: javaClass.properties.map(it => enhanceProperties(it))
    };
}