import { DbProperties } from '../model/model';
import { DatabaseConnection, DbTable } from './db.model';
import { MysqlConnection } from './mysql.connection';
import { log } from '../utils/log.utils';

export const getDatabaseTables = (dbProps: DbProperties): Promise<DbTable[]> => {
    let dbConnection: DatabaseConnection | undefined;
    log.trace(`${dbProps.type} connection detected`);
    switch (dbProps.type) {
        case 'mysql':
            dbConnection = new MysqlConnection()
    }

    return Promise.resolve(dbConnection?.getTables(dbProps) || []);
};
