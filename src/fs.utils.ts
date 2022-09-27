import * as fs from 'fs';

export interface EnvProperties {
    entitiesFolderPath: string
}

export function readEnvFile(): EnvProperties {
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

export function getFilesPath(path: string, fileRegex: string): string[] {
    const files: string[] = [];
    const regex = new RegExp(fileRegex)

    if (!fs.existsSync(path)) {
        throw Error(`Path ${path} does not exist`)
    }

    if (!fs.lstatSync(path).isDirectory()) {
        return [];
    }

    fs.readdirSync(path)
        .forEach(file => {
            const filePath = `${path}/${file}`;
            if (fs.lstatSync(filePath).isDirectory()) {
                return [...files, getFilesPath(filePath, fileRegex)]
            }
            if (regex.test(file)) {
                files.push(filePath);
            }
        });
    // console.log(`files ${files.length}`);
    return files;
}
