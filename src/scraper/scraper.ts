import { log } from '../utils/log.utils';
import { getFileContentSanitized } from './sanitizer';
import { matchGroupList, matchNamedGroups } from '../utils/regex.util';
import { removeUndefinedItems } from '../utils/array.utils';
import { AnnotationType, ClassInfo, ClassProperty, JavaAnnotation, JavaClass } from './scraper.model';
import { AnnotationTypeString } from '../data-enhance/data-enhace.model';
import { fileExists, getFiles, readFile } from '../utils/fs.utils';
import { ErrorLevel, errorRegister } from '../utils/error-register';
import { cdUp, findFilePathFromImportPath } from '../utils/path.utils';

// regex file
const javaFileRegex = new RegExp('.*.java$');

// regex class
const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? ?(?:private|protected|public) [\\w<, >.]+ \\w+(?: ?= ?[ \\w<>.,"()]+)?;', 'g');

export const captureClassInfo = new RegExp('(?<annotations>@[\\w =,"()@ .]+)?public (?:abstract )?[@\\w]+ (?<className>\\w+)(?:<[\\w, .]+>)?(?: extends (?<superClass>[\\w.]+)(?:<[\\w, .]+>?)?)?(?: implements [\\w.]+(?:<[\\w, .]+>)?)? ?{');
const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(?<name>\\w+)(?:\\((?<attributes>[ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('((?:([\\w ])+=)?[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp('(?<annotations>@[\\w =,"()@ .]+)? ?(?:private|protected|public) (?<type>[\\w.<, >]+) (?<name>\\w+)(?: ?= ?[ \\w<>.,"()]+)?;');

const captureAttributeNameAndValue = new RegExp('(?:(?<name>[\\w ]+)=)?(?:[ "]+)?(?<value>[\\w .]+)"?');

const getClassInfo = (javaFilePath: string, contentSanitized: string): ClassInfo | undefined => {
    try {

        const classInfo = matchNamedGroups<{ annotations: string, className: string, superClass: string }>(contentSanitized, captureClassInfo);

        const annotations = getAnnotations(classInfo.annotations);

        return {
            name: classInfo.className,
            annotations,
            superClass: classInfo.superClass
        };
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse java class info for', javaFilePath, e);
        return undefined;
    }
};

const getAnnotationAttributes = (attributesStringOptional: string | undefined): Record<string, string> => {
    if (attributesStringOptional === undefined) {
        return {};
    }
    try {
        const attributes = matchGroupList(attributesStringOptional, captureAnnotationAttributesItems);

        return removeUndefinedItems(
            attributes.map(it => matchNamedGroups<{ name: string | undefined, value: string }>(it, captureAttributeNameAndValue))
        ).reduce((agg, { name, value }): Record<string, string> => {
            agg[name ?? 'default'] = value;
            return agg;
        }, {} as Record<string, string>) || {};
    } catch (e) {
        errorRegister.register(ErrorLevel.Attribute);
        log.warn('Unable to parse annotation attributes for', attributesStringOptional, e);
        return {};
    }
};

const getAnnotation = (annotation: string): JavaAnnotation | undefined => {
    try {
        const match = matchNamedGroups<{ name: string, attributes: string | undefined }>(annotation, captureAnnotationNameAndAttribute);
        const attributes = getAnnotationAttributes(match.attributes);
        const name = AnnotationType[match.name as AnnotationTypeString];

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
        const annotationsName = matchGroupList(annotationString, captureFieldAnnotationRegex);
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
    log.trace('get property', property);
    try {
        const annotationsName = matchGroupList(property, captureFieldAnnotationRegex);
        log.trace('annotations name', annotationsName);

        const match = matchNamedGroups<{ name: string, annotations: string | undefined, type: string }>(property, capturePropertyNameAndAnnotations);
        log.trace('property name and annotations match', match);

        const annotations = getAnnotations(match.annotations);
        log.trace('annotations', annotations);

        return { name: match.name, type: match.type, annotations };
    } catch (e) {
        errorRegister.register(ErrorLevel.Property);
        log.error('Unable to property for', property, e);
        return undefined;
    }
};

const replaceEmbeddedPropertiesWithRelativeClassProperties = (javaFilePath: string, content: string, properties: ClassProperty[]): ClassProperty[] => {
    log.trace('start replaceEmbeddedPropertiesWithRelativeClassProperties');
    return properties.flatMap(property => {
        if (property.annotations.some(ann => ann.name === AnnotationType.Embedded)) {
            log.trace('embedded class found', property.type);
            const embeddedClass = scrapeClass(javaFilePath, property.type, content);
            return embeddedClass?.properties || [];
        }
        return [property];
    });
};

const getProperties = (javaFilePath: string, content: string): ClassProperty[] => {
    try {
        const propertiesString = matchGroupList(content, classFieldRegex);
        const propertiesOpt = propertiesString.map(property => getProperty(property));
        const properties = removeUndefinedItems(propertiesOpt);
        return replaceEmbeddedPropertiesWithRelativeClassProperties(javaFilePath, content, properties);
    } catch (e) {
        errorRegister.register(ErrorLevel.Property);
        log.warn('Unable to parse properties for', content, e);
        return [];
    }
};

const getClassLocation = (className: string, javaFilePath: string, content: string): string | undefined => {
    log.trace('get class location', className);
    let classImport: string | undefined = className;
    if (!className.includes('.')) {
        const importCaptureLocationRegex = new RegExp(`import (?<import>[\\w.]+${className});`);
        classImport = matchNamedGroups<{ import: string }>(content, importCaptureLocationRegex)?.import;
        if (classImport === undefined) {
            const superClassLocation = `${cdUp(javaFilePath)}/${className}.java`;
            log.trace('class location import not found, looking in the same folder', superClassLocation);
            if (!fileExists(superClassLocation)) {
                log.debug(`Super class ${className} detected in ${javaFilePath} but non found in the same folder. Maybe an internal class of Java?`);
                return undefined;
            }
            return superClassLocation;
        }
    }

    const classLocation = findFilePathFromImportPath(javaFilePath, classImport);
    log.trace('class location', classLocation);
    if (classLocation === undefined) {
        log.debug(`Super class detect in ${javaFilePath} but non found in the same folder. Does it belong to an external library?`);
        return undefined;
    }
    return `${classLocation}.java`;
};

const scrapeClass = (javaFilePath: string, className: string | undefined, content: string): JavaClass | undefined => {

    if (className === undefined) {
        return undefined;
    }
    const superClassLocation = getClassLocation(className, javaFilePath, content);
    if (superClassLocation === undefined) {
        return undefined;
    }
    return readAndScrape(superClassLocation, javaFilePath);
};

const scrapeJavaClass = (javaFilePath: string, content: string): JavaClass | undefined => {
    try {
        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(javaFilePath, contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const classInfo = getClassInfo(javaFilePath, contentSanitized);
        const superClass = scrapeClass(javaFilePath, classInfo?.superClass, contentSanitized);
        return {
            filePath: javaFilePath,
            name: classInfo?.name || javaFilePath,
            parentPath: superClass?.filePath,
            annotations: classInfo?.annotations || [],
            properties: [...superClass?.properties || [], ...properties]
        };
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse java class for', javaFilePath, e);
        return undefined;
    }
};

const readAndScrape = (javaFilePath: string, origin: string): JavaClass | undefined => {
    try {
        const content = readFile(javaFilePath);
        log.trace(`content file ${javaFilePath}`, content);
        const javaClass = scrapeJavaClass(javaFilePath, content);
        log.trace('java class', javaFilePath, javaClass);
        return javaClass;
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse java class', javaFilePath, '. \nOrigin class', origin, e);
        return undefined;
    }

};

export const scrapePath = (folder: string): JavaClass[] => {
    const javaFiles = getFiles(folder, javaFileRegex);
    log.debug('java files', javaFiles);
    log.info(`${javaFiles.length} java files detected`);

    try {
        const javaClasses = javaFiles.map(javaFilePath => readAndScrape(javaFilePath, javaFilePath));

        log.trace('num javaClasses', javaClasses.length);
        return removeUndefinedItems(javaClasses);
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse folder for', folder, e);
        return [];
    }
};
