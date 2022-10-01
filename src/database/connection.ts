import { DbProperties } from '../model/model';
import { DbTable } from './db.model';
import { getMysqlColumns } from './mysql.connection';

export const getDatabaseTables = (dbProps: DbProperties): Promise<DbTable[]> => {
    switch (dbProps.type) {
        case 'mysql':
            return getMysqlColumns(dbProps);
    }

    return Promise.resolve([]);
};
