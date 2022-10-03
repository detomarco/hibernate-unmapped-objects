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

export const captureClassInfo = new RegExp('(?<annotations>@[\\w =,"()@ .]+)?public (?:abstract )?[@\\w]+ (?<className>\\w+)(?:<[\\w, .]+>)?(?: extends (?<superClass>[\\w.]+)(?:<[\\w, .]+>?)?)?(?: implements [\\w.]+(?:<[\\w, .]+>)?)? ?{')
const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(?<name>\\w+)(?:\\((?<attributes>[ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('((?:([\\w ])+=)?[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp('(?<annotations>@[\\w =,"()@ .]+)? ?(?:private|protected|public) [\\w<, >]+ (?<name>\\w+)(?: ?= ?[ \\w<>.,"()]+)?;');

const captureAttributeNameAndValue = new RegExp('(?:(?<name>[\\w ]+)=)?(?:[ "]+)?(?<value>[\\w .]+)"?');

const getClassInfo = (javaFilePath: string, contentSanitized: string): ClassInfo | undefined => {
    try {

        const classInfo = matchNamedGroups<{ annotations: string, className: string, superClass: string }>(contentSanitized, captureClassInfo)

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
            attributes.map(it => matchNamedGroups<{name: string | undefined, value: string}>(it, captureAttributeNameAndValue))
        ).reduce((agg, {name, value}): Record<string, string> => {
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
        const match = matchNamedGroups<{name: string, attributes: string | undefined}>(annotation, captureAnnotationNameAndAttribute);
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
    try {
        const annotationsName = matchGroupList(property, captureFieldAnnotationRegex);

        const match = matchNamedGroups<{name: string, annotations: string | undefined}>(property, capturePropertyNameAndAnnotations);
        log.trace('annotations name', annotationsName);

        const annotations = getAnnotations(match.annotations);

        return { name: match.name, annotations };
    } catch (e) {
        errorRegister.register(ErrorLevel.Property);
        log.error('Unable to property for', property, e);
        return undefined;
    }
};

const getProperties = (content: string): ClassProperty[] => {
    try {
        const propertiesString = matchGroupList(content, classFieldRegex);
        const propertiesOpt = propertiesString.map(property => getProperty(property));
        return removeUndefinedItems(propertiesOpt);
    } catch (e) {
        errorRegister.register(ErrorLevel.Property);
        log.warn('Unable to parse properties for', content, e);
        return [];
    }
};

const getSuperClassLocation = (superClassName: string, javaFilePath: string, content: string): string | undefined => {
    let superClassImport: string | undefined = superClassName;
    if (!superClassName.includes(".")) {
        const importCaptureLocationRegex = new RegExp(`import (?<import>[\\w.]+${superClassName});`);
        superClassImport = matchNamedGroups<{ import: string }>(content, importCaptureLocationRegex)?.import;
        if (superClassImport === undefined) {
            const superClassLocation = `${cdUp(javaFilePath)}/${superClassName}.java`;
            if (!fileExists(superClassLocation)) {
                log.debug(`Super class ${superClassName} detected in ${javaFilePath} but non found in the same folder. Maybe an internal class of Java?`);
                return undefined;
            }
            return `${cdUp(javaFilePath)}/${superClassName}.java`;
        }
    }
    const superClassLocation = findFilePathFromImportPath(javaFilePath, superClassImport);
    if (superClassLocation === undefined) {
        log.debug(`Super class detect in ${javaFilePath} but non found in the same folder. Does it belong to an external library?`);
        return undefined;
    }
    return `${superClassLocation}.java`;
};

const scrapeSuperClass = (javaFilePath: string, classInfo: ClassInfo | undefined, content: string): JavaClass | undefined => {
    if (classInfo?.superClass === undefined) {
        return undefined;
    }

    const superClassLocation = getSuperClassLocation(classInfo.superClass, javaFilePath, content);
    if (superClassLocation === undefined) {
        log.warn(`Super class detect in ${javaFilePath} but location not found, skip it.`);
        return undefined;
    }
    return readAndScrape(superClassLocation, javaFilePath);
};

const scrapeJavaClass = (javaFilePath: string, content: string): JavaClass | undefined => {
    try {
        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const classInfo = getClassInfo(javaFilePath, contentSanitized);
        const superClass = scrapeSuperClass(javaFilePath, classInfo, contentSanitized);
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
