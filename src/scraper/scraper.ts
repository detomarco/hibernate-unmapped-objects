import {getFiles, readFile} from "../utils/fs.utils";
import {log} from "../utils/log.utils";
import {Annotation, ClassProperty, Table} from "../model/model";
import {getFileContentSanitized} from "./sanitizer";

const classFieldRegex = new RegExp("(?:@[\\w =,\"\\(\\)@ .]+)? private \\w+ \\w+;", 'g');

const fieldRegex = new RegExp("(?:@[\\w =,\"\\(\\)@ .]+)? private \\w+ \\w+;", 'g');
const captureFieldAnnotationRegex = new RegExp("(@\\w+(?:\\( [\\w= .,\"]+\\))?)", 'g');

const getProperties = (content: string): ClassProperty[] => {
    const properties: string[] = []
    for (const match of content.matchAll(classFieldRegex)) {
        properties.push(match[0].trim())
    }
    return properties.map(property => {
        const annotations: Annotation[] = []
        for (const matchC of property.matchAll(captureFieldAnnotationRegex)) {
            annotations.push({
                name: matchC[0].trim(),
                attributes: []
            })
        }
        return {name: property, annotations}
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
