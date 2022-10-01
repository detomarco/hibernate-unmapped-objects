import { log } from '../utils/log.utils';
import { getFileContentSanitized } from './sanitizer';
import { matchGroup, matchGroupList, matchGroups } from '../utils/regex.util';
import { removeUndefinedItems } from '../utils/array.utils';
import { AnnotationType, ClassProperty, JavaAnnotation, JavaClass } from './scraper.model';
import { MapString } from '../model/model';
import { AnnotationTypeString } from '../data-enhance/data-enhace.model';
import { getFiles, readFile } from '../utils/fs.utils';
import { ErrorLevel, errorRegister } from '../utils/error-register';
import { cdUp, findFilePathFromImportPath } from "../utils/path.utils";

// regex file
const javaFileRegex = new RegExp('.*.java$');

// regex class
const classFieldRegex = new RegExp('(?:@[\\w =,"()@ .]+)? private \\w+ \\w+;', 'g');
const classCaptureParentName = new RegExp("class \\w+ extends (\\w+) {");

const captureFieldAnnotationRegex = new RegExp('(@\\w+(?:\\([ \\w=.,")]+)?)', 'g');
const captureAnnotationNameAndAttribute = new RegExp('@(\\w+)(?:\\(([ \\w=.,"]+)\\))?');
const captureAnnotationAttributesItems = new RegExp('((?:([\\w ])+=)?[\\w." ]+)', 'g');

const capturePropertyNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?private \\w+ (\\w+);');
const captureClassNameAndAnnotations = new RegExp('(@[\\w =,"()@ .]+)?public (?:abstract )?[@\\w]+ (\\w+)');
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
        const attributes = matchGroupList(attributesStringOptional, captureAnnotationAttributesItems);

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
        const propertiesString = matchGroupList(content, classFieldRegex);
        const propertiesOpt = propertiesString.map(property => getProperty(property));
        return removeUndefinedItems(propertiesOpt);
    } catch (e) {
        errorRegister.register(ErrorLevel.Property);
        log.warn('Unable to parse properties for', content, e);
        return [];
    }
};

const getParentLocation = (superClassName: string, javaFilePath: string, content: string): string | undefined => {
    const importCaptureLocationRegex = new RegExp(`import ([\\w.]+${superClassName});`)
    const superClassImport = matchGroup(content, importCaptureLocationRegex);
    if (superClassImport === undefined) {
        return `${cdUp(javaFilePath)}/${superClassName}.java`
    }
    return findFilePathFromImportPath(javaFilePath, superClassImport) + '.java';
}

const scrapeSuperClass = (javaFilePath: string, content: string): JavaClass | undefined => {
    const superClassName = matchGroup(content, classCaptureParentName);
    if (superClassName === undefined) {
        return undefined
    }
    const superClassLocation = getParentLocation(superClassName, javaFilePath, content);
    if (superClassLocation === undefined) {
        log.warn(`Super class detect in ${javaFilePath} but location not found, skip it.`)
        return undefined
    }
    return readAndScrape(superClassLocation)
};

const scrapeJavaClass = (javaFilePath: string, content: string): JavaClass | undefined => {
    try {
        const contentSanitized = getFileContentSanitized(content);
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized);

        const properties = getProperties(contentSanitized);
        log.trace(`properties ${javaFilePath}`, properties);

        const superClass = scrapeSuperClass(javaFilePath, contentSanitized)
        const classInfo = getClassInfo(javaFilePath, contentSanitized);
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

export const readAndScrape = (javaFilePath: string): JavaClass | undefined => {
    try {
        const content = readFile(javaFilePath);
        log.trace(`content file ${javaFilePath}`, content);
        const javaClass = scrapeJavaClass(javaFilePath, content);
        log.trace('java class', javaFilePath, javaClass);
        return javaClass;
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse java class', javaFilePath, e);
        return undefined;
    }

};


export const scrapePath = (folder: string): JavaClass[] => {
    const javaFiles = getFiles(folder, javaFileRegex);
    log.debug('java files', javaFiles);
    log.info(`${javaFiles.length} java files detected`);

    try {
        const javaClasses = javaFiles.map(javaFilePath => readAndScrape(javaFilePath));

        log.trace('num javaClasses', javaClasses.length);
        return removeUndefinedItems(javaClasses);
    } catch (e) {
        errorRegister.register(ErrorLevel.Class);
        log.warn('Unable to parse folder for', folder, e);
        return [];
    }
};
