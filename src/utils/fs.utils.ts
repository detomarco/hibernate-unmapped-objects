import * as fs from 'fs';
import { EnvProperties, LogLevel, LogLevelString, SupportedDb } from '../model/model';

export const getEnvFile = (): EnvProperties => {
    const props: { [key: string]: string } = {};
    const envFile: string = fs.readFileSync('.env', 'utf-8');
    envFile.split('\n')
        .filter(line => !line.trim().startsWith('#'))
        .forEach(line => {
            const p = line.split('=');
            if (p.length === 2) {
                props[p[0]] = p[1];
            }
        });

    return {
        logLevel: LogLevel[props['logLevel'] as LogLevelString],
        entitiesFolderPath: props['entities_folder_path'],
        db: {
            type: props['db.type'] as SupportedDb,
            host: props['db.host'],
            user: props['db.user'],
            password: props['db.password'],
            information_schema: props['db.information_schema'],
            schema: props['db.schema'],
            port: parseInt(props['db.port'])
        }
    };
};

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
