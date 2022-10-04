import { DbProperties } from '../model/model';
import { DatabaseConnection, DbTable } from './db.model';
import { log } from '../utils/log.utils';
import * as mysql from 'mysql2';

interface MysqlResultType {
    TABLE_NAME: string,
    COLUMN_NAME: string
}

export class MysqlConnection extends DatabaseConnection {

    private handleResults = (resultSet: MysqlResultType[]): DbTable[] => {
        const resultsByTableName = resultSet.reduce((acc, result) => {
            acc[result.TABLE_NAME] = acc[result.TABLE_NAME] || [];
            acc[result.TABLE_NAME].push(result.COLUMN_NAME);
            return acc;
        }, {} as Record<string, string[]>);

        return Object.entries(resultsByTableName)
            .map(([name, columns]): DbTable => ({ name, columns }));
    };

    getTables(db: DbProperties): Promise<DbTable[]> {
        log.trace(`connection parameters: host:${db.host}, port:${db.port}, database: information_schema, user:${db.user}, password:****`);
        const connection = mysql.createConnection({
            host: db.host,
            port: db.port,
            user: db.user,
            password: db.password,
            database: 'information_schema'
        });

        return new Promise((resolve, reject) => {
            connection.query(
                `select *
                 from information_schema.columns
                 where table_schema = '${db.schema}'`,
                (err, results: MysqlResultType[]) => {

                    if (err === null) {
                        log.trace('mysql results', results);
                        const tables = this.handleResults(results);
                        log.debug('mysql tables', tables);
                        resolve(tables);
                    } else {
                        log.error('mysql error', err);
                        reject(err);
                    }
                }
            );
        });
    }

}
