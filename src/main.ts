import { getEnvFile } from './utils/fs.utils';
import { log } from './utils/log.utils';
import { enhanceJavaClass } from './data-enhance/data-enhance';
import { AnnotationType } from './scraper/scraper.model';
import { JavaTable } from './data-enhance/data-enhace.model';
import { scrape } from './scraper/scraper';
import { errorRegister } from './utils/error-register';
import { EnvProperties } from './model/model';
import { getDatabaseTables } from './database/connection';
import { compare } from './comparator/table-comparator';
import { printResults } from './result-printer/result-printer';

export const main = async(env: EnvProperties): Promise<JavaTable[]> => {

    log.error('error message with stck?', new Error());
    const databaseTables = await getDatabaseTables(env.db!);
    log.debug('database table', databaseTables);
    log.info(databaseTables.length, 'tables found in the database');

    const classes = scrape(env.entitiesFolderPath);
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
    errorRegister.printReport();

    return javaClasses;
};

const env = getEnvFile();
main(env);
