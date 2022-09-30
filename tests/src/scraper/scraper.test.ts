import { scrape } from '../../../src/scraper/scraper';
import { simpleEntityClass, tableEntityClass } from '../fixture/scraper.fixture';

describe('should scrape entity', () => {

    it('when simple entity', () => {
        const javaClass = scrape(simpleEntityClass.filePath);

        expect(javaClass).toEqual([simpleEntityClass]);
    });

    it('when entity with table annotation', () => {
        const javaClass = scrape(tableEntityClass.filePath);
        expect(javaClass).toEqual([tableEntityClass]);
    });

});

describe('should raise error', () => {

    it('when path does not exists', () => {
        expect(() => scrape('this_path_does_not_exist')).toThrow(new Error('Path \'this_path_does_not_exist\' does not exist'));
    });

});
