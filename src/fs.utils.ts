import * as fs from 'fs';
import {EnvProperties, LogLevel, LogLevelString} from "./model";

const annotationRegex = new RegExp('((?:@\\w+\\(?[a-zA-Z= ",._]*\\)?)+),?', 'g')
const annotationRegexWithField = new RegExp('((?:@\\w+\\(?[\\w= ",._]*\\)?)+,? private \\w+ \\w+);', 'g')
const fieldRegex = new RegExp("private \\w+ \\w+;")
const importRegex = new RegExp("(import .*;)", 'g')
const packageRegex = new RegExp("(package .*;)")
const javaFileRegex = new RegExp(".*.java$");

const getEnvFile = (): EnvProperties => {
    const props: { [key: string]: string } = {}
    const envFile: string = fs.readFileSync('.env', `utf-8`)
    envFile.split('\n')
        .filter(line => !line.trim().startsWith("#"))
        .forEach(line => {
            const p = line.split("=")
            if (p.length === 2) {
                props[p[0]] = p[1];
            }
        })
    return {
        logLevel: LogLevel[props["logLevel"] as LogLevelString],
        entitiesFolderPath: props["entities_folder_path"]
    }
}

export const getFiles = (path: string): string[] => {

    if (!fs.existsSync(path)) {
        throw Error(`Path ${path} does not exist`)
    }

    if (!fs.lstatSync(path).isDirectory()) {
        if (javaFileRegex.test(path)) {
            return [path];
        } else {
            return []
        }
    }

    const files: string[] = [];
    fs.readdirSync(path)
        .forEach(file => {
            const filePath = `${path}/${file}`;
            if (fs.lstatSync(filePath).isDirectory()) {
                return [...files, getFiles(filePath)]
            }
            if (javaFileRegex.test(file)) {
                files.push(filePath);
            }
        });
    return files;
}

const sanitizeInlineComments = (s: string): string => {
    return s.replace(/\/\/(.*)$/, "")
}

const sanitizeMultilineComments = (s: string): string => {
    return s.replace(/\/[\*]+(.*)\*\//, "")
}

const sanitizeEscapeCharacters = (s: string): string => {
    return s.replace(/\r\n|\n|\r|\t/gm, ' ')
        .replace(/\s\s+/g, ' ');
}


const removeImports = (s: string): string => {

    return s.replace(importRegex, '')
        .replace(packageRegex, '');
}

export const getFileContentSanitized = (filePath: string) => {
    const content = fs.readFileSync(filePath, `utf-8`);
    const noInlineComments = sanitizeInlineComments(content);
    const noImports = removeImports(noInlineComments);
    const noNewLines = sanitizeEscapeCharacters(noImports)
    const noMultiLines = sanitizeMultilineComments(noNewLines)
    return noMultiLines.trim()
}

export const env = getEnvFile()

