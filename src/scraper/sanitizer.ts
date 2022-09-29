import * as fs from 'fs';
import {EnvProperties, LogLevel, LogLevelString} from "../model/model";

const annotationRegex = new RegExp('((?:@\\w+\\(?[a-zA-Z= ",._]*\\)?)+),?', 'g')
const annotationRegexWithField = new RegExp('((?:@\\w+\\(?[\\w= ",._]*\\)?)+,? private \\w+ \\w+);', 'g')
const fieldRegex = new RegExp("private \\w+ \\w+;")
const importRegex = new RegExp("(import .*;)", 'g')
const packageRegex = new RegExp("(package .*;)")
const javaFileRegex = new RegExp(".*.java$");

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

export const getFileContentSanitized = (content: string): string => {
    const noInlineComments = sanitizeInlineComments(content);
    const noImports = removeImports(noInlineComments);
    const noNewLines = sanitizeEscapeCharacters(noImports)
    const noMultiLines = sanitizeMultilineComments(noNewLines)
    return noMultiLines.trim()
}
