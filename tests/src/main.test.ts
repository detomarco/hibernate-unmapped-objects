import { simpleEntityTable, tableEntityTable } from './fixture/data-enhance.fixture';
import { main } from '../../src/main';
import { LogLevel } from '../../src/model/model';

describe('should list unmapped objects', function() {

    it('when run script', () => {
        const result = main({
            logLevel: LogLevel.TRACE,
            entitiesFolderPath: './tests'
        });
        expect(result).toEqual(jasmine.arrayWithExactContents([simpleEntityTable, tableEntityTable]));
    });

});
