import { env } from './fs.utils';
import { scrape } from './scraper';
import { log } from './log.utils';

const entities = scrape(env.entitiesFolderPath);
log.trace('entities found', entities);
