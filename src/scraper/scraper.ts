import { getFiles, readFile } from '../utils/fs.utils';
import { log } from '../utils/log.utils';
import { Annotation, AnnotationAttribute, ClassProperty, JavaClass } from '../model/model';
import { getFileContentSanitized } from './sanitizer';
import { matchGroupMultiple, matchGroups } from '../utils/regex.util';
import { removeUndefinedItems } from '../utils/array.utils';

const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? private \\w+ \\w+;', 'g');
const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(\\w+)(?:\\(([ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('(([\\w ])+=[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?private \\w+ (\\w+);');
const captureClassNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?public class (\\w+)');
const captureNameAndValueAttribute = new RegExp('([\\w ]+)=(?:[ "]+)?([\\w .]+)(?:")?');
const getClassInfo = (contentSanitized: string): { name: string | undefined, annotations: Annotation[] } => {
    const { first: annotationStrings, second: name } = matchGroups(contentSanitized, captureClassNameAndAnnotations);
    const annotations = getAnnotations(annotationStrings);
    return { name, annotations };
};

const getAnnotationAttributes = (attributesStringOptional: string | undefined): AnnotationAttribute[] => {
    try {
        const attributes = matchGroupMultiple(attributesStringOptional, captureAnnotationAttributesItems);
        return attributes?.map((attribute): AnnotationAttribute => {
            const { first: name, second: value } = matchGroups(attribute, captureNameAndValueAttribute);
            return { name, value };
        }) || [];
    } catch (e) {
        log.error('Unable to parse annotation attributes for', attributesStringOptional, e);
        return [];
    }
};

const getAnnotation = (annotation: string): Annotation | undefined => {
    try {
        const { first: name, second: attributesStringOptional } = matchGroups(annotation, captureAnnotationNameAndAttribute);
        log.trace('annotation name', name);
        log.trace('annotation attributes', attributesStringOptional);
        const attributes = getAnnotationAttributes(attributesStringOptional);

        return { name, attributes };
    } catch (e) {
        log.error('Unable to parse annotation for', annotation, e);
        return undefined;
    }
};

const getAnnotations = (annotationString: string | undefined): Annotation[] => {
    try {
        const annotationsName = matchGroupMultiple(annotationString, captureFieldAnnotationRegex);
        log.trace('annotations name', annotationsName);

        const annotationsOpt = annotationsName?.map(annotation => getAnnotation(annotation)) || [];
        return removeUndefinedItems(annotationsOpt);
    } catch (e) {
        log.error('Unable to parse annotations for', annotationString, e);
        return [];
    }
};

const getProperty = (property: string): ClassProperty | undefined => {
    try {
        const annotationsName = matchGroupMultiple(property, captureFieldAnnotationRegex);

        const { first: annotationsString, second: propertyName } = matchGroups(property, capturePropertyNameAndAnnotations);
        log.trace('annotations name', annotationsName);

        const annotations = getAnnotations(annotationsString);
        return { property: propertyName, annotations };
    } catch (e) {
        log.error('Unable to property for', property, e);
        return undefined;
    }
};
const getProperties = (content: string): ClassProperty[] => {
    try {
        const propertiesString = matchGroupMultiple(content, classFieldRegex);
        const propertiesOpt = propertiesString.map(property => getProperty(property));
        return removeUndefinedItems(propertiesOpt);
    } catch (e) {
        log.error('Unable to parse properties for', content, e);
        return [];
    }
};

export const scrapeJavaClasses = (javaFilePath: string, content: string): JavaClass | undefined => {
    try {
        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const { name, annotations } = getClassInfo(contentSanitized);
        return {
            filePath: javaFilePath,
            name,
            annotations,
            properties
        };
    } catch (e) {
        log.error('Unable to parse java class for', javaFilePath, e);
        return undefined;
    }
};
