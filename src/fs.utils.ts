import * as fs from 'fs';

export interface EnvProperties {
    entitiesFolderPath: string
}

export const getEnvFile = (): EnvProperties => {
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
        entitiesFolderPath: props["entities_folder_path"]
    }
}

export const getFiles = (path: string, fileRegex: string): string[] => {
    const files: string[] = [];
    const regex = new RegExp(fileRegex)

    if (!fs.existsSync(path)) {
        throw Error(`Path ${path} does not exist`)
    }

    if (!fs.lstatSync(path).isDirectory()) {
        return [path];
    }

    fs.readdirSync(path)
        .forEach(file => {
            const filePath = `${path}/${file}`;
            if (fs.lstatSync(filePath).isDirectory()) {
                return [...files, getFiles(filePath, fileRegex)]
            }
            if (regex.test(file)) {
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
    return s.replace(/  |\r\n|\n|\r|\t/gm, '');
}

export const getFileContentSanitized = (filePath: string) => {
    const content = fs.readFileSync(filePath, `utf-8`);
    const noInlineComments = sanitizeInlineComments(content);
    const noNewLines = sanitizeEscapeCharacters(noInlineComments)
    return sanitizeMultilineComments(noNewLines)
}



