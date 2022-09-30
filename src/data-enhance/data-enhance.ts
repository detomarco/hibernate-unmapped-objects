import { JavaAnnotation, ClassProperty, JavaClass } from '../scraper/scraper.model';
import {
    AnnotationAttributeEnhance,
    AnnotationEnhance,
    AnnotationType,
    AnnotationTypeString,
    JavaColumn,
    JavaTable,
    NameAttributeEnhance
} from './data-enhace.model';

const enhanceAnnotation = (annotation: JavaAnnotation): AnnotationEnhance => {
    let attributes: AnnotationAttributeEnhance | undefined = undefined;
    switch (annotation.name) {
        case 'JoinColumn':
        case 'Column':
        case 'Entity':
        case 'Table':
            attributes = new NameAttributeEnhance(annotation.attributes);
    }

    return {
        ...annotation,
        name: AnnotationType[annotation.name as AnnotationTypeString],
        attributes
    };
};

const extractNameFromAnnotations = (annotations: AnnotationEnhance[]): string | undefined => {
    for (const annotation of annotations) {
        switch (annotation.name) {
            case AnnotationType.Entity:
            case AnnotationType.Column:
            case AnnotationType.JoinColumn:
            case AnnotationType.Table: {
                const attributes = annotation.attributes as NameAttributeEnhance;
                const name = attributes.default ?? attributes.name;
                if (name) {
                    return name;
                }
                break;
            }
        }
    }

    return undefined;
};

const enhanceProperties = (property: ClassProperty): JavaColumn => {
    const annotations = property.annotations.map(it => enhanceAnnotation(it));

    return {
        name: extractNameFromAnnotations(annotations) ?? property.name
    };
};

export const enhanceJavaClass = (javaClass: JavaClass): JavaTable => {
    const annotations = javaClass.annotations.map(it => enhanceAnnotation(it));
    return {
        filePath: javaClass.filePath,
        name: extractNameFromAnnotations(annotations) ?? javaClass.name,
        columns: javaClass.properties.map(it => enhanceProperties(it))
    };
};
