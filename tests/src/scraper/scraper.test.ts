import { scrapeJavaClass } from '../../../src/scraper/scraper';
import { getTestResource } from '../../utils/resource.utils';
import { JavaClass } from "../../../src/model/model";

describe('should scrape simple entity', function () {
    it('add', function () {

        const javaPath = 'SimpleEntity.java';
        const javaClassContent = getTestResource(javaPath);
        const javaClass = scrapeJavaClass(javaPath, javaClassContent);

        const expected: JavaClass = {
            filePath: javaPath,
            name: 'SimpleEntity',
            annotations: [{
                name: 'Entity',
                attributes: []
            }],
            properties: [{
                property: 'id',
                annotations: [{
                    name: 'Id',
                    attributes: []
                }, {
                    name: 'GeneratedValue',
                    attributes: [{
                        name: 'strategy',
                        value: 'GenerationType.AUTO'
                    }, {
                        name: 'generator',
                        value: 'native'
                    }]
                }, {
                    name: 'GenericGenerator',
                    attributes: [{
                        name: 'name',
                        value: 'native'
                    }, {
                        name: 'strategy',
                        value: 'native'
                    }]
                }]
            }, {
                property: 'date',
                annotations: []
            }, {
                property: 'clazz',
                annotations: []
            }, {
                property: 'who',
                annotations: [{
                    name: 'ManyToOne',
                    attributes: [{
                        name: 'fetch',
                        value: 'FetchType.LAZY'
                    },{
                        name: 'optional',
                        value: 'false'
                    }]
                },{
                    name: 'JoinColumn',
                    attributes: [{
                        name: 'name',
                        value: 'USER_FK'
                    }]
                }]
            }]
        };

        expect(javaClass).toEqual(expected);
    });

});
