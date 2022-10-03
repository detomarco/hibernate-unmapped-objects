import { captureClassInfo, scrapePath } from '../../../src/scraper/scraper';
import {
    abstractClass,
    annotationClass, child2Class, childClass, genericClass,
    interfaceClass,
    simpleEntityClass,
    tableEntityClass
} from '../fixture/scraper.fixture';
import { matchNamedGroups } from '../../../src/utils/regex.util';
import { Scenario } from '../utils/model';

describe('should scrape class', () => {

    fit('when simple entity', () => {
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

    it('when it contains generics', () => {
        const javaClass = scrapePath(genericClass.filePath);
        expect(javaClass).toEqual([genericClass]);
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

describe('should return correct info', () => {

    const scenarios: Scenario<string, any>[] = [{
        input: 'public class GenericEntity {',
        output: { className: 'GenericEntity' },
        description: 'class'
    }, {
        input: '@Entity public class GenericEntity{',
        output: { annotations: '@Entity', className: 'GenericEntity' },
        description: 'annotation and class '
    }, {
        input: '@Entity public class ChildEntity extends Parent implements Serializable {',
        output: { annotations: '@Entity', className: 'ChildEntity', superClass: 'Parent' },
        description: 'class and parent '
    }, {
        input: '@Entity public class GenericEntity extends org.GenericParent<T>{',
        output: { annotations: '@Entity', className: 'GenericEntity', superClass: 'org.GenericParent' },
        description: 'annotation, class, parent'
    }, {
        input: 'public class GenericEntity<T> extends GenericParent<T>{',
        output: { className: 'GenericEntity', superClass: 'GenericParent' },
        description: 'class and parent with generics'
    }, {
        input: 'public class GenericEntity<T> extends GenericParent<T> implements Interface<T>{',
        output: { className: 'GenericEntity', superClass: 'GenericParent' },
        description: 'class, parent, interface'
    }, {
        input: 'public class GenericEntity<T> implements org.Interface<T>{',
        output: { className: 'GenericEntity' },
        description: 'class, interface'
    }];

    scenarios.forEach(scenario => {
        it(`when capture class info for ${scenario.description}`, () => {
            expect(matchNamedGroups(scenario.input, captureClassInfo)).toEqual(scenario.output);
        });
    });

});
