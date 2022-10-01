import { AnnotationType, ClassProperty, JavaAnnotation, JavaClass } from '../scraper/scraper.model';
import { JavaTable, NameAttributeEnhance } from './data-enhace.model';

const extractNameFromAnnotations = (annotations: JavaAnnotation[]): string | undefined => {
    for (const annotation of annotations) {
        switch (annotation.name) {
            case AnnotationType.Entity:
            case AnnotationType.Column:
            case AnnotationType.JoinColumn:
            case AnnotationType.Table: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const attributes = annotation.attributes as any as NameAttributeEnhance;
                const name = attributes.default ?? attributes.name;
                if (name) {
                    return name;
                }
            }
        }
    }

    return undefined;
};

const enhanceProperties = (property: ClassProperty): string => extractNameFromAnnotations(property.annotations) ?? property.name;

export const enhanceJavaClass = (javaClass: JavaClass): JavaTable => ({
    filePath: javaClass.filePath,
    name: extractNameFromAnnotations(javaClass.annotations) ?? javaClass.name,
    columns: javaClass.properties.map(it => enhanceProperties(it))
});
