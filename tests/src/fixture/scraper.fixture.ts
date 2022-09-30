import { JavaClass } from '../../../src/scraper/scraper.model';

export const simpleEntityClass: JavaClass = {
    filePath: 'SimpleEntity.java',
    name: 'SimpleEntity',
    annotations: [{
        name: 'Entity',
        attributes: {}
    }],
    properties: [{
        name: 'id',
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
        name: 'date',
        annotations: []
    }, {
        name: 'clazz',
        annotations: []
    }, {
        name: 'who',
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

export const tableEntityClass: JavaClass = {
    filePath: 'TableEntity.java',
    name: 'TableEntity',
    annotations: [{
        name: 'Entity',
        attributes: {}
    }, {
        name: 'Table',
        attributes: {
            default: "Tables"
        }
    }],
    properties: [{
        name: 'id',
        annotations: []
    }]
};
