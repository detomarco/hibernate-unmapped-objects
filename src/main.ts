import {getFiles, getEnvFile, getFileContentSanitized} from "./fs.utils";
import {Logger} from "./log.utils";

const log = new Logger();

const javaFileRegex = new RegExp(".*.java$");

const env = getEnvFile()
const javaFiles = getFiles(env.entitiesFolderPath, javaFileRegex)
log.debug(`java files ${javaFiles.length}`)

const entities = javaFiles.filter(javaFilePath => {
    const content = getFileContentSanitized(javaFilePath)
    return content.includes("@Entity")
});
log.trace(`entities`, entities)
log.debug(`num entities`, entities.length)
