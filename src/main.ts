import { getEnvFile } from './utils/fs.utils';
import { log } from './utils/log.utils';
import { enhanceJavaClass } from './data-enhance/data-enhance';
import { AnnotationType } from './scraper/scraper.model';
import { JavaTable } from './data-enhance/data-enhace.model';
import { scrape } from './scraper/scraper';
import { errorRegister } from "./utils/error-register";
import { EnvProperties } from "./model/model";

export const main = (env: EnvProperties): JavaTable[] => {
    const entities = scrape(env.entitiesFolderPath);
    log.trace('scrape result', entities);
    log.info(`${entities.length} entities parsed`);

    const entitiesEnhanced = entities
        .filter(entity => entity.annotations.some(it => it.name === AnnotationType.Entity))
        .map(entity => enhanceJavaClass(entity));

    log.debug('data enhance result', entitiesEnhanced);
    log.info(`${entitiesEnhanced.length} tables parsed`);

    errorRegister.printReport()
    return entitiesEnhanced;
};

const env = getEnvFile();
main(env);
