import { childEntityTable, simpleEntityTable, tableEntityTable } from './fixture/data-enhance.fixture';
import { main } from '../../src/main';
import { LogLevel } from '../../src/model/model';

describe('should list unmapped objects', function() {

    it('when run script', async() => {
        const result = await main({
            showStacktrace: true,
            logLevel: LogLevel.TRACE,
            entitiesFolderPath: './tests',
            db: {
                type: 'mysql',
                host: 'localhost',
                port: 3399,
                user: 'huo_app',
                password: 'test',
                schema: 'huo'
            }
        });
        expect(result).toEqual(jasmine.arrayWithExactContents([simpleEntityTable, tableEntityTable, childEntityTable]));
    });

});
