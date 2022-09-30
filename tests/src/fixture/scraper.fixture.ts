import { AnnotationType, JavaClass } from '../../../src/scraper/scraper.model';

export const simpleEntityClass: JavaClass = {
    filePath: './tests/resources/SimpleEntity.java',
    name: 'SimpleEntity',
    annotations: [{
        name: AnnotationType.Entity,
        attributes: {}
    }],
    properties: [{
        name: 'id',
        annotations: [{
            name: AnnotationType.Id,
            attributes: {}
        }, {
            name: AnnotationType.GeneratedValue,
            attributes: {
                strategy: 'GenerationType.AUTO',
                generator: 'native'
            }
        }, {
            name: AnnotationType.GenericGenerator,
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
            name: AnnotationType.ManyToOne,
            attributes: {
                fetch: 'FetchType.LAZY',
                optional: 'false'
            }
        }, {
            name: AnnotationType.JoinColumn,
            attributes: {
                name: 'USER_FK'
            }
        }]
    }]
};

export const tableEntityClass: JavaClass = {
    filePath: './tests/resources/TableEntity.java',
    name: 'TableEntity',
    annotations: [{
        name: AnnotationType.Entity,
        attributes: {}
    }, {
        name: AnnotationType.Table,
        attributes: {
            default: 'Tables'
        }
    }],
    properties: [{
        name: 'id',
        annotations: []
    }]
};
