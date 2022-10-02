import { getConfigFile } from './utils/fs.utils';
import { log } from './utils/log.utils';
import { enhanceJavaClass } from './data-enhance/data-enhance';
import { JavaTable } from './data-enhance/data-enhace.model';
import { scrapePath } from './scraper/scraper';
import { ConfigProperties } from './model/model';
import { getDatabaseTables } from './database/connection';
import { compare } from './comparator/table-comparator';
import { printResults } from './result-printer/result-printer';
import { AnnotationType } from './scraper/scraper.model';
import { DbTable } from "./database/db.model";
import { UnmappedObjects } from "./comparator/table-comparator.model";

interface ScriptResults {
    javaEntities: JavaTable[],
    databaseTables: DbTable[],
    results: UnmappedObjects
}

export const main = async (config: ConfigProperties): Promise<ScriptResults> => {

    const databaseTables = await getDatabaseTables(config.db);
    log.debug('database table', databaseTables);
    log.info(databaseTables.length, 'tables found in the database');

    const classes = scrapePath(config.entitiesFolderPath);
    log.trace('scrape result', classes);
    log.info(`${classes.length} classes parsed`);

    const javaEntities = classes
        .filter(clazz => clazz.annotations.some(it => it.name === AnnotationType.Table || it.name === AnnotationType.Entity))
        .map(clazz => enhanceJavaClass(clazz));

    log.debug('data enhance result', javaEntities);
    log.info(`${javaEntities.length} tables parsed`);

    const unmappedObjects = compare(databaseTables, javaEntities);

    printResults(unmappedObjects);

    return {
        javaEntities: javaEntities,
        databaseTables: databaseTables,
        results: unmappedObjects
    };
};

const config = getConfigFile();
main(config);
