import * as fs from 'fs';
import { ConfigProperties, LogLevel } from '../model/model';

const CONFIG_FILE = '.huo.json';

const getArgs = () => {
    const args = process.argv.slice(2);
    return args.reduce((agg, it) => {
        const nameValue = it.split("=");
        agg[nameValue[0]] = nameValue[1];
        return agg;
    }, {} as Record<string, string>);
}


export const getConfigFile = (): ConfigProperties => {
    const args = getArgs()
    console.debug("Args", args)
    const configContent: string = fs.readFileSync(args.configFile ?? CONFIG_FILE, 'utf-8');
    const config = JSON.parse(configContent);

    return {
        ...config,
        logLevel: LogLevel[config.logLevel]

    };
};

export const getFiles = (path: string, javaFileRegex: RegExp): string[] => {

    if (!fileExists(path)) {
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

export const fileExists = (path: string): boolean => fs.existsSync(path);
