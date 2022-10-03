import { JavaTable } from '../../../src/data-enhance/data-enhace.model';

export const simpleEntityTable: JavaTable = {
    filePath: './tests/resources/SimpleEntity.java',
    name: 'SimpleEntity',
    columns: ['id', 'date', 'field', 'USER_FK']
};

export const tableEntityTable: JavaTable = {
    filePath: './tests/resources/TableEntity.java',
    name: 'Tables',
    columns: ['id']
};

export const childEntityTable: JavaTable = {
    filePath: './tests/resources/ChildEntity.java',
    name: 'ChildEntity',
    columns: ['id', 'protectedField', 'publicField', 'field']
};

export const genericEntityTable: JavaTable = {
    filePath: './tests/resources/GenericEntity.java',
    name: 'GenericEntity',
    columns: ['id', 'values']
};

export const childEntity2Table: JavaTable = {
    filePath: './tests/resources/ChildEntity2.java',
    name: 'ChildEntity2',
    columns: ['id', 'field']
};
