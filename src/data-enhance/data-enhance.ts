import { ClassProperty, JavaAnnotation, JavaClass } from '../scraper/scraper.model';
import { AnnotationType, AnnotationTypeString, JavaColumn, JavaTable, NameAttributeEnhance } from './data-enhace.model';

const extractNameFromAnnotations = (annotations: JavaAnnotation[]): string | undefined => {
    for (const annotation of annotations) {
        const annotationName = AnnotationType[annotation.name as AnnotationTypeString]
        switch (annotationName) {
            case AnnotationType.Entity:
            case AnnotationType.Column:
            case AnnotationType.JoinColumn:
            case AnnotationType.Table: {
                const attributes = annotation.attributes as any as NameAttributeEnhance;
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
    return {
        name: extractNameFromAnnotations(property.annotations) ?? property.name
    };
};

export const enhanceJavaClass = (javaClass: JavaClass): JavaTable => {

    return {
        filePath: javaClass.filePath,
        name: extractNameFromAnnotations(javaClass.annotations) ?? javaClass.name,
        columns: javaClass.properties.map(it => enhanceProperties(it))
    };
};
