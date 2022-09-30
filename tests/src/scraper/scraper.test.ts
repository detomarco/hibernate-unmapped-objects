import { scrapeJavaClass } from '../../../src/scraper/scraper';
import { getTestResource } from '../../utils/resource.utils';

describe('should scrape simple entity', function() {
    it('add', function() {

        const javaPath = 'SimpleEntity.java';
        const javaClassContent = getTestResource(javaPath);
        const javaClass = scrapeJavaClass(javaPath, javaClassContent);

        expect(javaClass).toBeDefined();
    });

});
