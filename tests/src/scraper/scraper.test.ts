import { scrapeJavaClass } from '../../../src/scraper/scraper';
import { getTestResource } from '../../utils/resource.utils';
import { simpleEntityClass } from '../fixture/scraper.result';

describe('should scrape simple entity', function() {
    it('add', function() {

        const javaClassContent = getTestResource(simpleEntityClass.filePath);
        const javaClass = scrapeJavaClass(simpleEntityClass.filePath, javaClassContent);

        expect(javaClass).toEqual(simpleEntityClass);
    });

});
