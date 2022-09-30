import { scrapeJavaClass } from '../../../src/scraper/scraper';
import { getTestResource } from '../../utils/resource.utils';
import { simpleEntityClass, tableEntityClass } from '../fixture/scraper.result';

describe('should scrape entity', function() {
    it('when simple entity', function() {

        const javaClassContent = getTestResource(simpleEntityClass.filePath);
        const javaClass = scrapeJavaClass(simpleEntityClass.filePath, javaClassContent);

        expect(javaClass).toEqual(simpleEntityClass);
    });


    it('when entity with table annotation', function() {

        const javaClassContent = getTestResource(tableEntityClass.filePath);
        const javaClass = scrapeJavaClass(tableEntityClass.filePath, javaClassContent);

        expect(javaClass).toEqual(tableEntityClass);
    });

});
