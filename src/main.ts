import { env } from './utils/fs.utils';
import { scrape } from './scraper/scraper';
import { log } from './utils/log.utils';

const entities = scrape(env.entitiesFolderPath);

log.trace('scrape result', entities);
