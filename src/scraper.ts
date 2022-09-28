import {getFiles, getFileContentSanitized} from "./fs.utils";
import {log} from "./log.utils";

const javaFileRegex = new RegExp(".*.java$");

export const scrape = (folder: string) => {

    const javaFiles = getFiles(folder, javaFileRegex)
    log.trace('java files', javaFiles)
    log.debug('num java files', javaFiles.length)

    const entities = javaFiles.filter(javaFilePath => {
        const content = getFileContentSanitized(javaFilePath)
        return content.includes("@Entity")
    });
    log.trace(`entities`, entities)
    log.debug(`num entities`, entities.length)

}
