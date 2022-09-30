import { getResourceContent } from '../../utils/resource.utils';
import { scrapeJavaClasses } from "../../../src/scraper/scraper";


describe('should scrape simple entity', function() {
    it('add', function() {

        const javaClassContent = getResourceContent('SimpleEntity.java')
        const javaClass = scrapeJavaClasses('SimpleEntity.java', javaClassContent)

        expect(javaClass).toBeDefined()
    });


});
