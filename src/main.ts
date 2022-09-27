import {getFilesPath, readEnvFile} from "./fs.utils";

const javaFileRegex = "^[a-zA-Z0-9]+\\.java$";

console.log("Hello word")

const env = readEnvFile()
console.log(env)

const javaFiles = getFilesPath(env.entitiesFolderPath, javaFileRegex)
console.log(javaFiles)
