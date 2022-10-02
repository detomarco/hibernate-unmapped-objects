import { printResults } from '../../../src/printer/result-printer';

describe('should print results', () => {

    fit('when unmapped table are detected ', () => {
        spyOn(console, 'log');
        printResults(
            { unmappedTables: ['unmapped Table', 'schema_version'], unmappedColumns: {} },
            {
                ignoreTables: ['schema_version'],
                ignoreColumns: []
            }
        );
        expect(console.log).toHaveBeenCalledWith('\n 1 unmapped tables detected');
        expect(console.log).toHaveBeenCalledWith(['unmapped Table']);
    });

    it('when unmapped columns are detected ', () => {
        spyOn(console, 'log');
        spyOn(console, 'table');
        printResults({
            unmappedTables: [],
            unmappedColumns: {
                'entity': ['unmapped column', 'second unmapped column', 'ignored_column']
            }
        }, {
            ignoreTables: [],
            ignoreColumns: ['ignored_column']
        });

        expect(console.log).toHaveBeenCalledWith('\nUnmapped columns');
        expect(console.table).toHaveBeenCalledWith([{
            table: 'entity',
            columns: 'unmapped column, second unmapped column'
        }]);
    });

});

describe('should print no results message', () => {

    it('when no unmapped columns are detected', () => {
        spyOn(console, 'log');
        printResults({ unmappedTables: [], unmappedColumns: {} }, {
            ignoreTables: [],
            ignoreColumns: []
        });
        expect(console.log).toHaveBeenCalledWith('No unmapped objects have been detected. Good job! 👍');
    });

});
