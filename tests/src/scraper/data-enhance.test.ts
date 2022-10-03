import { scrapePath } from '../../../src/scraper/scraper';
import { simpleEntityClass, tableEntityClass } from '../fixture/scraper.fixture';
import { enhanceJavaClass } from '../../../src/data-enhance/data-enhance';
import { simpleEntityTable, tableEntityTable } from '../fixture/data-enhance.fixture';

describe('should enhance date', () => {

    it('when simple class', () => {
        const javaClass = scrapePath(simpleEntityClass.filePath);
        console.log('JAVA CLASS', javaClass);
        const table = enhanceJavaClass(javaClass[0]);
        expect(table).toEqual(simpleEntityTable);
    });

    it('when class with different table name', () => {
        const javaClass = scrapePath(tableEntityClass.filePath);
        const table = enhanceJavaClass(javaClass[0]);
        expect(table).toEqual(tableEntityTable);
    });

});
