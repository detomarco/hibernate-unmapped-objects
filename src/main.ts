import {getFiles, getEnvFile, getFileContentSanitized} from "./fs.utils";

const javaFileRegex = "^[a-zA-Z0-9]+\\.java$";

const env = getEnvFile()
const javaFiles = getFiles(env.entitiesFolderPath, javaFileRegex)
console.log(`java files ${javaFiles.length}`)

const entities = javaFiles.filter(javaFilePath => {
    const content = getFileContentSanitized(javaFilePath)
    return content.includes("@Entity")
});
console.log(`entities ${entities.length}`)
