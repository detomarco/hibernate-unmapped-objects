
const sanitizeInlineComments = (s: string): string => s.replace(/\/\/(.*)$/, '');

const sanitizeMultilineComments = (s: string): string => s.replace(/\/\*([\s\S]*?)\*\//, '');

const sanitizeEscapeCharacters = (s: string): string => s.replace(/\r\n|\n|\r|\t/gm, ' ')
        .replace(/\s\s+/g, ' ');

export const getFileContentSanitized = (content: string): string => {
    const noInlineComments = sanitizeInlineComments(content);
    const noNewLines = sanitizeEscapeCharacters(noInlineComments);
    const noMultiLines = sanitizeMultilineComments(noNewLines);
    return noMultiLines.trim();
};
