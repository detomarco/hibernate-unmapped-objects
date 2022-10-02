import { scrapePath } from '../../../src/scraper/scraper';
import {
    abstractClass,
    annotationClass, child2Class, childClass,
    interfaceClass,
    simpleEntityClass,
    tableEntityClass
} from '../fixture/scraper.fixture';

describe('should scrape class', () => {

    it('when simple entity', () => {
        const javaClass = scrapePath(simpleEntityClass.filePath);

        expect(javaClass).toEqual([simpleEntityClass]);
    });

    it('when entity with table annotation', () => {
        const javaClass = scrapePath(tableEntityClass.filePath);
        expect(javaClass).toEqual([tableEntityClass]);
    });

    it('when it is abstract', () => {
        const javaClass = scrapePath(abstractClass.filePath);
        expect(javaClass).toEqual([abstractClass]);
    });

    it('when it is an interface', () => {
        const javaClass = scrapePath(interfaceClass.filePath);
        expect(javaClass).toEqual([interfaceClass]);
    });

    it('when it is an annotation', () => {
        const javaClass = scrapePath(annotationClass.filePath);
        expect(javaClass).toEqual([annotationClass]);
    });

});

describe('should detect and scraper parent class', () => {

    it('when parent is in the same folder', () => {
        const javaClass = scrapePath(childClass.filePath);
        expect(javaClass).toEqual([childClass]);
    });

    it('when parent is in a different folder', () => {
        const javaClass = scrapePath(child2Class.filePath);
        expect(javaClass).toEqual([child2Class]);
    });

});

describe('should raise error', () => {

    it('when path does not exists', () => {
        expect(() => scrapePath('this_path_does_not_exist')).toThrow(new Error('Path \'this_path_does_not_exist\' does not exist'));
    });

});
