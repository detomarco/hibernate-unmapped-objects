import { simpleEntityTable, tableEntityTable } from './fixture/data-enhance.fixture';
import { main } from '../../src/main';

describe('should list unmapped objects', function() {

    it('when run script', () => {
        const result = main();
        expect(result).toEqual(jasmine.arrayWithExactContents([simpleEntityTable({ filePath: './tests/resources/SimpleEntity.java' }), tableEntityTable({ filePath: './tests/resources/TableEntity.java' })]));
    });

});
