import {getFiles, getFileContentSanitized} from "./fs.utils";
import {log} from "./log.utils";
import {Table} from "./model";

const fieldRegex = new RegExp("(private \\w+ \\w+);", 'g')

const getColumns = (content: string): string[] => {
    const columns: string[] = []
    for (const match of content.matchAll(fieldRegex)) {
        columns.push(match[1])
    }
    return columns;
}

export const scrape = (folder: string): Table[] => {

    const javaFiles = getFiles(folder)
    log.trace('java files', javaFiles)
    log.debug('num java files', javaFiles.length)

    const entities: Table[] = javaFiles.map(javaFilePath => {
        const content = getFileContentSanitized(javaFilePath)
        log.trace(`content file ${javaFilePath}`, content)
        const columns = getColumns(content)
        log.info(`columns ${javaFilePath}`, columns)
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
