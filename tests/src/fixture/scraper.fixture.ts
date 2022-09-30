import { JavaClassScraper } from '../../../src/scraper/scraper.model';

export const simpleEntityClass: JavaClassScraper = {
    filePath: 'SimpleEntity.java',
    name: 'SimpleEntity',
    annotations: [{
        name: 'Entity',
        attributes: {}
    }],
    properties: [{
        property: 'id',
        annotations: [{
            name: 'Id',
            attributes: {}
        }, {
            name: 'GeneratedValue',
            attributes: {
                strategy: 'GenerationType.AUTO',
                generator: 'native'
            }
        }, {
            name: 'GenericGenerator',
            attributes: {
                name: 'native',
                strategy: 'native'
            }
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
            attributes: {
                fetch: 'FetchType.LAZY',
                optional: 'false'
            }
        }, {
            name: 'JoinColumn',
            attributes: {
                name: 'USER_FK'
            }
        }]
    }]
};

export const tableEntityClass: JavaClassScraper = {
    filePath: 'TableEntity.java',
    name: 'TableEntity',
    annotations: [{
        name: 'Entity',
        attributes: {}
    }, {
        name: 'Table',
        attributes: {
            default: "TableEntity"
        }
    }],
    properties: [{
        property: 'id',
        annotations: []
    }]
};
