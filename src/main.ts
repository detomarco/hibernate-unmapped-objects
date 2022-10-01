import { getConfigFile } from './utils/fs.utils';
import { log } from './utils/log.utils';
import { enhanceJavaClass } from './data-enhance/data-enhance';
import { AnnotationType } from './scraper/scraper.model';
import { JavaTable } from './data-enhance/data-enhace.model';
import { scrapePath } from './scraper/scraper';
import { ConfigProperties } from './model/model';
import { getDatabaseTables } from './database/connection';
import { compare } from './comparator/table-comparator';
import { printResults } from './result-printer/result-printer';

export const main = async(config: ConfigProperties): Promise<JavaTable[]> => {

    const databaseTables = await getDatabaseTables(config.db);
    log.debug('database table', databaseTables);
    log.info(databaseTables.length, 'tables found in the database');

    const classes = scrapePath(config.entitiesFolderPath);
    log.trace('scrape result', classes);
    log.info(`${classes.length} classes parsed`);

    const javaClasses = classes
        .filter(clazz => clazz.annotations.some(it => it.name === AnnotationType.Entity))
        .map(clazz => enhanceJavaClass(clazz));

    log.debug('data enhance result', javaClasses);
    log.info(`${javaClasses.length} tables parsed`);

    log.debug('data enhance result', javaClasses);
    log.info(`${databaseTables.length} tables found in the codebase`);

    const unmappedObjects = compare(databaseTables, javaClasses);

    printResults(unmappedObjects);

    return javaClasses;
};

const config = getConfigFile();
main(config);
