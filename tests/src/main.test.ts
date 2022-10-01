import { simpleEntityTable, tableEntityTable } from './fixture/data-enhance.fixture';
import { main } from '../../src/main';
import { LogLevel } from '../../src/model/model';

describe('should list unmapped objects', function () {

    it('when run script', async () => {
        const result = await main({
            logLevel: LogLevel.TRACE,
            entitiesFolderPath: './tests',
            db: undefined
        });
        expect(result).toEqual(jasmine.arrayWithExactContents([simpleEntityTable, tableEntityTable]));
    });

});
