import { getResourceContent } from '../../utils/resource.utils';


describe('calculate', function() {
    it('add', function() {

        const javaClass = getResourceContent('SimpleEntity.java')
        console.debug(javaClass)
        expect(7).toBe(7);
    });


});
