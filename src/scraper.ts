import {getFiles, readFile} from "./fs.utils";
import {log} from "./log.utils";
import {Annotation, Column, Table} from "./model";
import {getFileContentSanitized} from "./sanitizer";

const classFieldRegex = new RegExp("(?:@[\\w =,\"\\(\\)@ .]+)? private \\w+ \\w+;", 'g');

const fieldRegex = new RegExp("(?:@[\\w =,\"\\(\\)@ .]+)? private \\w+ \\w+;", 'g');
const captureFieldAnnotationRegex = new RegExp("(@\\w+(?:\\( [\\w= .,\"]+\\))?)", 'g');

const getColumns = (content: string): Column[] => {
    const columns: string[] = []
    for (const match of content.matchAll(classFieldRegex)) {
        columns.push(match[0].trim())
    }
    return columns.map(column => {
        const annotations: Annotation[] = []
        for (const matchC of column.matchAll(captureFieldAnnotationRegex)) {
            annotations.push({
                name: matchC[0].trim(),
                attributes: []
            })
        }
        return {name: column, annotations}
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
        log.info(`content file sanitized ${javaFilePath}`, contentSanitized)
        const columns = getColumns(contentSanitized)
        log.info(`columns ${javaFilePath}`, contentSanitized)
        return {
            filePath: javaFilePath,
            name: '',
            annotations: [],
            columns: columns
        }
    });

    log.trace(`entities`, entities)
    log.debug(`num entities`, entities.length)

    return [];
}
