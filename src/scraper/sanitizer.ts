const importRegex = new RegExp('(import .*;)', 'g');
const packageRegex = new RegExp('(package .*;)');

const sanitizeInlineComments = (s: string): string => s.replace(/\/\/(.*)$/, '');

const sanitizeMultilineComments = (s: string): string => s.replace(/\/[]+(.*)\*\//, '');

const sanitizeEscapeCharacters = (s: string): string => s.replace(/\r\n|\n|\r|\t/gm, ' ')
        .replace(/\s\s+/g, ' ');

const removeImports = (s: string): string => s.replace(importRegex, '')
        .replace(packageRegex, '');

export const getFileContentSanitized = (content: string): string => {
    const noInlineComments = sanitizeInlineComments(content);
    const noImports = removeImports(noInlineComments);
    const noNewLines = sanitizeEscapeCharacters(noImports);
    const noMultiLines = sanitizeMultilineComments(noNewLines);
    return noMultiLines.trim();
};
