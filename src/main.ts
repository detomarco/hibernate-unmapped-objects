import { env } from './utils/fs.utils';
import { scrape } from './scraper/scraper';

const entities = scrape(env.entitiesFolderPath);
