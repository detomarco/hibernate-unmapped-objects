import { scrapePath } from '../../../src/scraper/scraper';
import { tableEntityClass } from '../fixture/scraper.fixture';
import { enhanceJavaClass } from '../../../src/data-enhance/data-enhance';
import { tableEntityTable } from '../fixture/data-enhance.fixture';
import { printResults } from "../../../src/printer/result-printer";

describe('should print results', () => {

    it('when unmapped table are detected ', () => {
        spyOn(console, 'log');
        printResults({ unmappedTables: ['unmapped Table'], unmappedColumns: {} });
        expect(console.log).toHaveBeenCalledWith('\nUnmapped tables', ['unmapped Table']);
    });

    it('when unmapped columns are detected ', () => {
        spyOn(console, 'log');
        spyOn(console, 'table');
        printResults({
            unmappedTables: [],
            unmappedColumns: {
                'entity': ['unmapped column', 'second unmapped column']
            }
        });

        expect(console.log).toHaveBeenCalledWith('\nUnmapped columns');
        expect(console.table).toHaveBeenCalledWith([{
            table: 'entity',
            columns: 'unmapped column, second unmapped column'
        }]);
    });

    it('when class with different table name', () => {
        const javaClass = scrapePath(tableEntityClass.filePath);
        const table = enhanceJavaClass(javaClass[0]);
        expect(table).toEqual(tableEntityTable);
    });

});


describe('should print no results message', () => {

    it('when no unmapped columns are detected', () => {
        spyOn(console, 'log');
        printResults({ unmappedTables: [], unmappedColumns: {} });
        expect(console.log).toHaveBeenCalledWith('No unmapped objects have been detected. Good job! 👍');
    });

});
