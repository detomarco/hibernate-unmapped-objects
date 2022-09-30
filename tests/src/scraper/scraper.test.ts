import { scrape } from '../../../src/scraper/scraper';
import {
    abstractClass,
    annotationClass,
    interfaceClass,
    simpleEntityClass,
    tableEntityClass
} from '../fixture/scraper.fixture';

describe('should scrape class', () => {

    it('when simple entity', () => {
        const javaClass = scrape(simpleEntityClass.filePath);

        expect(javaClass).toEqual([simpleEntityClass]);
    });

    it('when entity with table annotation', () => {
        const javaClass = scrape(tableEntityClass.filePath);
        expect(javaClass).toEqual([tableEntityClass]);
    });

    it('when it is abstract', () => {
        const javaClass = scrape(abstractClass.filePath);
        expect(javaClass).toEqual([abstractClass]);
    });

    it('when it is an interface', () => {
        const javaClass = scrape(interfaceClass.filePath);
        expect(javaClass).toEqual([interfaceClass]);
    });

    it('when it is an annotation', () => {
        const javaClass = scrape(annotationClass.filePath);
        expect(javaClass).toEqual([annotationClass]);
    });

});

describe('should raise error', () => {

    it('when path does not exists', () => {
        expect(() => scrape('this_path_does_not_exist')).toThrow(new Error('Path \'this_path_does_not_exist\' does not exist'));
    });

});
