import { getEnvFile } from './utils/fs.utils';
import { log } from './utils/log.utils';
import { enhanceJavaClass } from './data-enhance/data-enhance';
import { AnnotationType } from './scraper/scraper.model';
import { JavaTable } from './data-enhance/data-enhace.model';
import { scrape } from './scraper/scraper';
import { errorRegister } from './utils/error-register';
import { EnvProperties } from './model/model';

export const main = (env: EnvProperties): JavaTable[] => {
    const classes = scrape(env.entitiesFolderPath);
    log.trace('scrape result', classes);
    log.info(`${classes.length} classes parsed`);

    const entitiesEnhanced = classes
        .filter(clazz => clazz.annotations.some(it => it.name === AnnotationType.Entity))
        .map(clazz => enhanceJavaClass(clazz));

    log.debug('data enhance result', entitiesEnhanced);
    log.info(`${entitiesEnhanced.length} tables parsed`);

    errorRegister.printReport();
    return entitiesEnhanced;
};

const env = getEnvFile();
main(env);
