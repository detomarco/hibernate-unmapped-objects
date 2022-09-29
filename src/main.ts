import {env} from "./fs.utils";
import {scrape} from "./scraper";

const entities = scrape(env.entitiesFolderPath)
