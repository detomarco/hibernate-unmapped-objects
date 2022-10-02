import { findFilePathFromImportPath } from '../../../src/utils/path.utils';

describe('should get file location', () => {

    it('give import location', () => {

        const importLocation = findFilePathFromImportPath('./tests/resources/ChildEntity2.java', 'resources.subpackage.ParentOtherLocation');
        expect(importLocation).toBe('./tests/resources/subpackage/ParentOtherLocation');
    });

});
