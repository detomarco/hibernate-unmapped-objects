import { DbProperties } from '../model/model';
import { DbTable } from './db.model';
import { getMysqlColumns } from './mysql.connection';
import { log } from "../utils/log.utils";

export const getDatabaseTables = (dbProps: DbProperties): Promise<DbTable[]> => {
    switch (dbProps.type) {
        case 'mysql':
            log.trace("mysql connection detected")
            return getMysqlColumns(dbProps);
    }

    return Promise.resolve([]);
};
