import {
    childEntityTable,
    genericEntityTable,
    simpleEntityTable,
    tableEntityTable
} from './fixture/data-enhance.fixture';
import { main } from '../../src/main';
import { LogLevel } from '../../src/model/model';

describe('should list unmapped objects', () => {

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

        const javaClasses = [simpleEntityTable, tableEntityTable, childEntityTable, childEntityTable, genericEntityTable];
        expect(javaEntities)
            .toHaveSize(5);
        expect(javaEntities)
            .toEqual(jasmine.arrayWithExactContents(javaClasses));

        expect(databaseTables).toHaveSize(4);

        expect(results.unmappedTables)
            .toEqual(jasmine.arrayWithExactContents(['UnmappedTable', 'schema_version']));

        expect(results.unmappedColumns['SimpleEntity'])
            .toEqual(jasmine.arrayWithExactContents(['who', 'unmappedColumn', 'modifiedAt']));

    });

});
