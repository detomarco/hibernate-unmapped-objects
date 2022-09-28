import {getFiles, getEnvFile, getFileContentSanitized} from "./fs.utils";
import {Logger} from "./log.utils";

const log = new Logger();

const javaFileRegex = new RegExp("^[a-zA-Z0-9]+\\.java$");

const env = getEnvFile()
const javaFiles = getFiles(env.entitiesFolderPath, javaFileRegex)
log.debug(`java files ${javaFiles.length}`)

const entities = javaFiles.filter(javaFilePath => {
    const content = getFileContentSanitized(javaFilePath)
    return content.includes("@Entity")
});
log.debug(`entities ${entities.length}`)
