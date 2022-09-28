import {getFiles, getFileContentSanitized} from "./fs.utils";
import {log} from "./log.utils";
import {Entity} from "./model";

const javaFileRegex = new RegExp(".*.java$");

export const scrape = (folder: string): Entity[] => {

    const javaFiles = getFiles(folder, javaFileRegex)
    log.trace('java files', javaFiles)
    log.debug('num java files', javaFiles.length)

    const entities: Entity[]  = javaFiles.map(javaFilePath => {
        const content = getFileContentSanitized(javaFilePath)
        log.trace(`content file ${javaFilePath}`, content)
        return {
            filePath: javaFilePath,
            annotations: [],
            columns: []
        }
    });

    log.trace(`entities`, entities)
    log.debug(`num entities`, entities.length)

    return [];
}
