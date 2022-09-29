import {getFiles, readFile} from "../utils/fs.utils";
import {log} from "../utils/log.utils";
import {Annotation, AnnotationAttribute, ClassProperty, Table} from "../model/model";
import {getFileContentSanitized} from "./sanitizer";
import {getGroups} from "../utils/regex.util";

const classFieldRegex = new RegExp("(?:@[\\w =,\"()@ .]+)? private \\w+ \\w+;", 'g');
const captureFieldAnnotationRegex = new RegExp("(@\\w+(?:\\([ \\w=.,\")]+)?)", 'g');
const captureAnnotationNameAndAttribute = new RegExp("@(\\w+)(?:\\(([ \\w=.,\"]+)\\))?")

const getProperties = (content: string): ClassProperty[] => {
    const properties = getGroups(content, classFieldRegex)

    return properties.map(property => {
        const annotationsName = getGroups(property, captureFieldAnnotationRegex)
        log.debug("annotations name", annotationsName)
        const annotations = annotationsName.map(annotation => {
            const annotationParts = annotation.match(captureAnnotationNameAndAttribute)
            const name = annotationParts![1]
            const attributes = annotationParts![2]?.trim()
            log.trace("ann name", name)
            log.trace("ann attributes", attributes)
            return {
                name: name,
                attributes: [{
                    name: attributes,
                    value: attributes
                }]
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
        log.trace(`properties ${javaFilePath}`, properties)

        return {
            filePath: javaFilePath,
            name: '',
            annotations: [],
            properties: properties
        }
    });

    log.debug(`entities`, JSON.stringify(entities, null, 4))
    log.debug(`num entities`, entities.length)

    return [];
}
