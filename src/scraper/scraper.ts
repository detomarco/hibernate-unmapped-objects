import { log } from '../utils/log.utils';
import { getFileContentSanitized } from './sanitizer';
import { matchGroupMultiple, matchGroups } from '../utils/regex.util';
import { removeUndefinedItems } from '../utils/array.utils';
import { AnnotationType, ClassProperty, JavaAnnotation, JavaClass } from './scraper.model';
import { MapString } from '../model/model';
import { AnnotationTypeString } from '../data-enhance/data-enhace.model';
import { getFiles, readFile } from '../utils/fs.utils';
import { ErrorLevel, errorRegister } from '../utils/error-register';

// regex file
const javaFileRegex = new RegExp('.*.java$');

// regex class
const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? private \\w+ \\w+;', 'g');

const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(\\w+)(?:\\(([ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('((?:([\\w ])+=)?[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?private \\w+ (\\w+);');
const captureClassNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?public [@\\w]+ (\\w+)');
const captureNameAndValueAttribute = new RegExp('(?:([\\w ]+)=)?(?:[ "]+)?([\\w .]+)"?');

const getClassInfo = (javaFilePath: string, contentSanitized: string): { name: string | undefined, annotations: JavaAnnotation[] } | undefined => {
    try {
        const match = matchGroups(contentSanitized, captureClassNameAndAnnotations);
        const annotations = getAnnotations(match.first);
        return { name: match.second, annotations };
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse java class info for', javaFilePath, e);
        return undefined;
    }
};

const getAnnotationAttributes = (attributesStringOptional: string | undefined): MapString => {
    if (attributesStringOptional === undefined) {
        return {};
    }
    try {
        const attributes = matchGroupMultiple(attributesStringOptional, captureAnnotationAttributesItems);

        return removeUndefinedItems(
            attributes.map(it => matchGroups(it, captureNameAndValueAttribute))
        ).reduce((agg, match): MapString => {
            const cc = match.first ?? 'default';
            agg[cc] = match.second;
            return agg;
        }, {} as MapString) || {};
    } catch (e) {
        errorRegister.register(ErrorLevel.Attribute);
        log.warn('Unable to parse annotation attributes for', attributesStringOptional, e);
        return {};
    }
};

const getAnnotation = (annotation: string): JavaAnnotation | undefined => {
    try {
        const match = matchGroups(annotation, captureAnnotationNameAndAttribute);
        const attributes = getAnnotationAttributes(match.second);
        const name = AnnotationType[match.first! as AnnotationTypeString];

        return { name, attributes };
    } catch (e) {
        errorRegister.register(ErrorLevel.Annotation);
        log.warn('Unable to parse annotation for', annotation, e);
        return undefined;
    }
};

const getAnnotations = (annotationString: string | undefined): JavaAnnotation[] => {
    if (annotationString === undefined) {
        return [];
    }

    try {
        const annotationsName = matchGroupMultiple(annotationString, captureFieldAnnotationRegex);
        log.trace('annotations name', annotationsName);

        const annotationsOpt = annotationsName.map(annotation => getAnnotation(annotation)) || [];
        return removeUndefinedItems(annotationsOpt);
    } catch (e) {
        errorRegister.register(ErrorLevel.Annotation);
        log.warn('Unable to parse annotations for', annotationString, e);
        return [];
    }
};

const getProperty = (property: string): ClassProperty | undefined => {
    try {
        const annotationsName = matchGroupMultiple(property, captureFieldAnnotationRegex);

        const match = matchGroups(property, capturePropertyNameAndAnnotations);
        log.trace('annotations name', annotationsName);

        const annotations = getAnnotations(match.first);

        return { name: match.second, annotations };
    } catch (e) {
        errorRegister.register(ErrorLevel.Property);
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
        errorRegister.register(ErrorLevel.Property);
        log.warn('Unable to parse properties for', content, e);
        return [];
    }
};

const scrapeJavaClass = (javaFilePath: string, content: string): JavaClass | undefined => {
    try {
        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const classInfo = getClassInfo(javaFilePath, contentSanitized);
        return {
            filePath: javaFilePath,
            name: classInfo?.name || javaFilePath,
            annotations: classInfo?.annotations || [],
            properties
        };
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse java class for', javaFilePath, e);
        return undefined;
    }
};

export const scrape = (folder: string): JavaClass[] => {
    const javaFiles = getFiles(folder, javaFileRegex);
    log.debug('java files', javaFiles);
    log.info(`${javaFiles.length} java files found`);

    try {

        const javaClasses = javaFiles.map(javaFilePath => {
            try {
                const content = readFile(javaFilePath);
                log.trace(`content file ${javaFilePath}`, content);
                const javaClass = scrapeJavaClass(javaFilePath, content);
                log.trace('java class', javaFilePath, javaClass);
                return javaClass;
            } catch (e) {
                log.warn('Unable to parse java class', javaFilePath, e);
                return undefined;
            }
        });

        log.trace('num javaClasses', javaClasses.length);
        return removeUndefinedItems(javaClasses);
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse folder for', folder, e);
        return [];
    }
};
