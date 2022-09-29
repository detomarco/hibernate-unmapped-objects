import {getFiles, readFile} from "../utils/fs.utils";
import {log} from "../utils/log.utils";
import {Annotation, ClassProperty, Table} from "../model/model";
import {getFileContentSanitized} from "./sanitizer";
import {getGroups} from "../utils/regex.util";

const regexComponents = {
    annotationAttributes: "(?:\\([ \\w=.,\"\\)]+)?"
};

const classFieldRegex = new RegExp("(?:@[\\w =,\"\\(\\)@ .]+)? private \\w+ \\w+;", 'g');
const fieldAnnotation = new RegExp("@\\w+" + regexComponents.annotationAttributes, 'g');
const captureFieldAnnotationRegex = new RegExp("(@\\w+" + regexComponents.annotationAttributes + ")", 'g');

const getProperties = (content: string): ClassProperty[] => {
    const properties = getGroups(content, classFieldRegex)

    return properties.map(property => {
        const annotationsName = getGroups(property, captureFieldAnnotationRegex)
        log.debug("annotations name", annotationsName)
        const annotations = annotationsName.map(annotation => {
            const attributesName = getGroups(annotation, fieldAnnotation)
            log.debug("attributes name", attributesName)

            return {
                name: annotation,
                attributes: []
            }
        })
        return {property, annotations}
    });
}

export const scrape = (folder: string): Table[] => {

    const javaFiles = getFiles(folder)
    log.trace('java files', javaFiles)
    log.debug('num java files', javaFiles.length)

    const entities: Table[] = javaFiles.map(javaFilePath => {
        const content = readFile(javaFilePath)
        log.trace(`content file ${javaFilePath}`, content)

        const contentSanitized = getFileContentSanitized(content)
        log.trace(`content file sanitized ${javaFilePath}`, contentSanitized)

        const properties = getProperties(contentSanitized)
        log.info(`properties ${javaFilePath}`, properties)

        return {
            filePath: javaFilePath,
            name: '',
            annotations: [],
            properties: properties
        }
    });

    log.trace(`entities`, entities)
    log.debug(`num entities`, entities.length)

    return [];
}
