import {getFiles, getEnvFile, getFileContentSanitized} from "./fs.utils";

const javaFileRegex = "^[a-zA-Z0-9]+\\.java$";

console.log("Hello word")

const env = getEnvFile()
console.log(env)

const javaFiles = getFiles(env.entitiesFolderPath, javaFileRegex)
console.log(javaFiles)

const contents = javaFiles.map(javaFilePath => getFileContentSanitized(javaFilePath))
console.log(contents)
