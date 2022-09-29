import { getFiles, readFile } from '../utils/fs.utils';
import { log } from '../utils/log.utils';
import { Annotation, AnnotationAttribute, ClassProperty, JavaClass } from '../model/model';
import { getFileContentSanitized } from './sanitizer';
import { getGroups } from '../utils/regex.util';

const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? private \\w+ \\w+;', 'g');
const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(\\w+)(?:\\(([ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('(([\\w ])+=[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp("(@[\\w =,\"()@ .]+)? private \\w+ (\\w+);");
const captureClassNameAndAnnotations = new RegExp("(@[\\w =,\"()@ .]+)? public class (\\w+)");

const getClassInfo = (contentSanitized: string): { name: string, annotations: Annotation[] } => {
    const annotationParts = contentSanitized.match(captureClassNameAndAnnotations);
    const annotationStrings = annotationParts![1];
    const name = annotationParts![2]?.trim();
    const annotations = getAnnotations(annotationStrings)
    return { name, annotations }
}

const getAnnotationAttributes = (attributesStringOptional: string | undefined): AnnotationAttribute[] => {
    try {
        const attributes = attributesStringOptional ? getGroups(attributesStringOptional, captureAnnotationAttributesItems) : undefined;
        return attributes?.map((attribute): AnnotationAttribute => {
            const [name, value] = attribute.split('=');
            return { name, value };
        }) || [];
    } catch (e) {
        log.error("Unable to parse annotation attributes for", attributesStringOptional, e)
        return [];
    }
};

const getAnnotations = (annotationString: string): Annotation[] => {
    try {
        const annotationsName = getGroups(annotationString, captureFieldAnnotationRegex);
        log.trace('annotations name', annotationsName);

        return annotationsName.map(annotation => {
            const annotationParts = annotation.match(captureAnnotationNameAndAttribute);
            const name = annotationParts![1];
            const attributesStringOptional = annotationParts![2]?.trim();
            log.trace('ann name', name);
            log.trace('ann attributes', attributesStringOptional);
            const attributes = getAnnotationAttributes(attributesStringOptional);

            return { name, attributes };
        });
    } catch (e) {
        log.error("Unable to parse annotation for", annotationString, e)
        return [];
    }
};

const getProperties = (content: string): ClassProperty[] => {
    try {
        const properties = getGroups(content, classFieldRegex);

        return properties.map(property => {
            const annotationsName = getGroups(property, captureFieldAnnotationRegex);

            const propertyParts = property.match(capturePropertyNameAndAnnotations);
            const annotationsString = propertyParts![1]?.trim();
            const propertyName = propertyParts![2]?.trim();

            log.trace('annotations name', annotationsName);
            const annotations = getAnnotations(annotationsString);
            return { property: propertyName, annotations };
        });
    } catch (e) {
        log.error("Unable to parse properties for", content, e)
        return [];
    }
};

const scrapeJavaClasses = (javaFilePath: string): JavaClass | undefined => {
    try {
        const content = readFile(javaFilePath);
        log.trace(`content file ${javaFilePath}`, content);

        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const { name, annotations } = getClassInfo(contentSanitized)
        return {
            filePath: javaFilePath,
            name: name,
            annotations: annotations,
            properties: properties
        };
    } catch (e) {
        log.error("Unable to parse java class for", javaFilePath, e)
        return undefined;
    }
}
export const scrape = (folder: string): JavaClass[] => {

    try {
        const javaFiles = getFiles(folder);
        log.trace('java files', javaFiles);
        log.trace('num java files', javaFiles.length);

        const javaClasses = javaFiles
            .map(javaFilePath => scrapeJavaClasses(javaFilePath))
            .filter(it => it != undefined)
            .map(it => it!);

        log.debug('javaClasses', JSON.stringify(javaClasses, null, 4));
        log.trace('num javaClasses', javaClasses.length);
        return javaClasses
    } catch (e) {
        log.error("Unable to parse folder for", folder, e)
        return [];
    }
};
