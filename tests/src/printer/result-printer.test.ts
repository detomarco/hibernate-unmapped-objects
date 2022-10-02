import { printResults } from '../../../src/printer/result-printer';

describe('should print results', () => {

    it('when unmapped table are detected ', () => {

        const printerResults = printResults(
            { unmappedTables: ['unmapped Table', 'schema_version'], unmappedColumns: {} },
            {
                ignoreTables: ['schema_version'],
                ignoreColumns: []
            }
        );
        expect(printerResults.unmappedTablesFound).toBe(true);
    });

    it('when unmapped columns are detected ', () => {

        const printerResults = printResults({
            unmappedTables: [],
            unmappedColumns: {
                'entity': ['unmapped column', 'second unmapped column', 'ignored_column']
            }
        }, {
            ignoreTables: [],
            ignoreColumns: ['ignored_column']
        });

        expect(printerResults.unmappedColumnFound).toBe(true);
    });

});

describe('should print no results message', () => {

    it('when no unmapped columns are detected', () => {

        const printerResults = printResults({ unmappedTables: [], unmappedColumns: {} }, {
            ignoreTables: [],
            ignoreColumns: []
        });
        expect(printerResults.unmappedColumnFound).toBe(false);
        expect(printerResults.unmappedTablesFound).toBe(false);
    });

});
