import { JavaTable } from "../../../src/data-enhance/data-enhace.model";

export const simpleEntityTable: JavaTable = {
    filePath: 'SimpleEntity.java',
    name: 'SimpleEntity',
    columns: [{
        name: 'id',
    }, {
        name: 'date',
    }, {
        name: 'clazz',
    }, {
        name: 'USER_FK',
    }]
};

export const tableEntityTable: JavaTable = {
    filePath: 'TableEntity.java',
    name: 'Tables',
    columns: [{
        name: 'id'
    }]
};
