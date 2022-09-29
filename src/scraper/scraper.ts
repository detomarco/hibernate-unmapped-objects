import { getFiles, readFile } from '../utils/fs.utils';
import { log } from '../utils/log.utils';
import { Annotation, AnnotationAttribute, ClassProperty, Table } from '../model/model';
import { getFileContentSanitized } from './sanitizer';
import { getGroups } from '../utils/regex.util';

const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? private \\w+ \\w+;', 'g');
const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(\\w+)(?:\\(([ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('(([\\w ])+=[\\w." ]+)', 'g');

const getAnnotationAttributes = (attributesStringOptional: string): AnnotationAttribute[] => {
    const attributes = attributesStringOptional ? getGroups(attributesStringOptional, captureAnnotationAttributesItems) : undefined;
    return attributes?.map((attribute): AnnotationAttribute => {
        const [name, value] = attribute.split('=');
        return { name, value };
    }) || [];

};

const getAnnotations = (property: string): Annotation[] => {
    const annotationsName = getGroups(property, captureFieldAnnotationRegex);
    log.debug('annotations name', annotationsName);

    return annotationsName.map(annotation => {
        const annotationParts = annotation.match(captureAnnotationNameAndAttribute);
        const name = annotationParts![1];
        const attributesStringOptional = annotationParts![2]?.trim();
        log.trace('ann name', name);
        log.trace('ann attributes', attributesStringOptional);
        const attributes = getAnnotationAttributes(attributesStringOptional);

        return { name, attributes };
    });
};
const getProperties = (content: string): ClassProperty[] => {
    const properties = getGroups(content, classFieldRegex);

    return properties.map(property => {
        const annotationsName = getGroups(property, captureFieldAnnotationRegex);
        log.debug('annotations name', annotationsName);
        const annotations = getAnnotations(property);
        return { property, annotations };
    });
};

export const scrape = (folder: string): Table[] => {

    const javaFiles = getFiles(folder);
    log.trace('java files', javaFiles);
    log.debug('num java files', javaFiles.length);

    const entities: Table[] = javaFiles.map(javaFilePath => {
        const content = readFile(javaFilePath);
        log.trace(`content file ${javaFilePath}`, content);

        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        return {
            filePath: javaFilePath,
            name: '',
            annotations: [],
            properties: properties
        };
    });

    log.debug('entities', JSON.stringify(entities, null, 4));
    log.debug('num entities', entities.length);

    return [];
};
