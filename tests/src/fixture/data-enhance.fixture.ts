import { JavaTable } from '../../../src/data-enhance/data-enhace.model';

export const simpleEntityTable = (override: Partial<JavaTable> | undefined = undefined): JavaTable => ({
        filePath: 'SimpleEntity.java',
        name: 'SimpleEntity',
        columns: [{
            name: 'id'
        }, {
            name: 'date'
        }, {
            name: 'clazz'
        }, {
            name: 'USER_FK'
        }],
        ...override
    });

export const tableEntityTable = (override: Partial<JavaTable> | undefined = undefined): JavaTable => ({
        filePath: 'TableEntity.java',
        name: 'Tables',
        columns: [{
            name: 'id'
        }],
        ...override
    });
