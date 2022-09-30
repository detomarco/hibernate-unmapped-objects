import { env, getFiles, readFile } from './utils/fs.utils';
import { log } from './utils/log.utils';
import { JavaClass } from './model/scraper.model';
import { removeUndefinedItems } from './utils/array.utils';
import { scrapeJavaClass } from './scraper/scraper';

const javaFileRegex = new RegExp('.*.java$');

export const scrape = (folder: string): JavaClass[] => {
    try {
        const javaFiles = getFiles(folder, javaFileRegex);
        log.trace('java files', javaFiles);
        log.info(`${javaFiles.length} java files found`);

        const javaClasses = javaFiles.map(javaFilePath => {
            try {
                const content = readFile(javaFilePath);
                log.trace(`content file ${javaFilePath}`, content);
                const javaClass = scrapeJavaClass(javaFilePath, content);
                log.info('java class', javaFilePath, javaClass);
                return javaClass;
            } catch (e) {
                log.error('Unable to parse java class', javaFilePath, e);
                return undefined;
            }
        });

        log.trace('num javaClasses', javaClasses.length);
        return removeUndefinedItems(javaClasses);
    } catch (e) {
        log.error('Unable to parse folder for', folder, e);
        return [];
    }
};

const entities = scrape(env.entitiesFolderPath);

log.trace('scrape result', entities);
