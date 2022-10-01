import * as fs from 'fs';
import { ConfigProperties, LogLevel } from '../model/model';

const CONFIG_FILE = '.huo.json';


export const cdUp = (path: string): string => {
    const lastPath = path.lastIndexOf("/");
    return path.substring(0, lastPath)
};

// export const findImportPath = (filePath: string, importPath: string): string => {
//     // outside/com/marco/detoma/gmail/ChildPath
//     //
//     // com.marco.ParencClass
//
//     const importPathToFile = importPath.replace(/\./g, "/")
//
// };

export const getFiles = (path: string, javaFileRegex: RegExp): string[] => {

    if (!fs.existsSync(path)) {
        throw new Error(`Path '${path}' does not exist`);
    }

    if (!fs.lstatSync(path).isDirectory()) {
        if (javaFileRegex.test(path)) {
            return [path];
        } else {
            return [];
        }
    }

    let files: string[] = [];
    fs.readdirSync(path)
        .forEach(file => {
            const filePath = `${path}/${file}`;
            if (fs.lstatSync(filePath).isDirectory()) {
                files = [...files, ...getFiles(filePath, javaFileRegex)];
            } else if (javaFileRegex.test(file)) {
                files.push(filePath);
            }
        });
    return files;
};

export const readFile = (filePath: string): string => fs.readFileSync(filePath, 'utf-8');
