import { scrapeJavaClass } from '../../../src/scraper/scraper';
import { getTestResource } from '../../utils/resource.utils';
import { simpleEntityClass, tableEntityClass } from '../fixture/scraper.fixture';
import { enhanceJavaClass } from '../../../src/data-enhance/data-enhance';
import { simpleEntityTable, tableEntityTable } from '../fixture/data-enhance.fixture';

describe('should enhance date', () => {

    it('when simple class', () => {
        const javaClassContent = getTestResource(simpleEntityClass.filePath);
        const javaClass = scrapeJavaClass(simpleEntityClass.filePath, javaClassContent);
        const table = enhanceJavaClass(javaClass!);
        expect(table).toEqual(simpleEntityTable);
    });

    it('when class with different table name', () => {
        const javaClassContent = getTestResource(tableEntityClass.filePath);
        const javaClass = scrapeJavaClass(tableEntityClass.filePath, javaClassContent);
        const table = enhanceJavaClass(javaClass!);
        expect(table).toEqual(tableEntityTable);
    });

});
