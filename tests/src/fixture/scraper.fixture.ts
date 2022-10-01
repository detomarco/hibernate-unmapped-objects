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
        name: 'field',
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

export const abstractClass: JavaClass = {
    filePath: './tests/resources/AbstractClass.java',
    name: 'AbstractClass',
    annotations: [],
    properties: []
};

export const interfaceClass: JavaClass = {
    filePath: './tests/resources/Interface.java',
    name: 'Interface',
    annotations: [],
    properties: []
};

export const annotationClass: JavaClass = {
    filePath: './tests/resources/Annotation.java',
    name: 'Annotation',
    annotations: [{
        name: AnnotationType.Column,
        attributes: {
            default: 'ElementType.FIELD'
        }
    }],
    properties: []
};


export const childClass: JavaClass = {
    filePath: './tests/resources/ChildEntity.java',
    name: 'ChildEntity',
    annotations: [{
        name: AnnotationType.Entity,
        attributes: {}
    }],
    properties: [{
        name: 'id',
        annotations: []
    }, {
        name: 'field',
        annotations: []
    }]
};
