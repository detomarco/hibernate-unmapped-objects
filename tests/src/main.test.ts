import { childEntityTable, simpleEntityTable, tableEntityTable } from './fixture/data-enhance.fixture';
import { main } from '../../src/main';
import { LogLevel } from '../../src/model/model';

describe('should list unmapped objects', function () {

    it('when run script', async() => {

        const { javaEntities, databaseTables, results } = await main({
            showStacktrace: true,
            logLevel: LogLevel.TRACE,
            entitiesFolderPath: './tests',
            printer: {
                ignoreTables: ['schema_version'],
                ignoreColumns: ['modifiedAt']
            },
            db: {
                type: 'mysql',
                host: 'localhost',
                port: 3399,
                user: 'huo_app',
                password: 'test',
                schema: 'huo'
            }
        });

        expect(javaEntities).toEqual(jasmine.arrayWithExactContents(
            [simpleEntityTable, tableEntityTable, childEntityTable, childEntityTable]
        ));
        expect(databaseTables).toHaveSize(4);
        expect(results).toEqual({
            unmappedTables: ['UnmappedTable', 'schema_version'],
            unmappedColumns: {
                'SimpleEntity': ['modifiedAt', 'unmappedColumn', 'who']
            }
        });

    });

});
