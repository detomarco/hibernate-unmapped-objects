import { DbProperties } from "../model/model";
import { DbTable } from "./db.model";
import { log } from "../utils/log.utils";
import * as mysql from "mysql2";

interface MysqlResultType {
    TABLE_NAME: string,
    COLUMN_NAME: string
}

export const handleResults = (resultSet: MysqlResultType[]): DbTable[] => {
    const resultsByTableName = resultSet.reduce((acc, result) => {
        acc[result.TABLE_NAME] = acc[result.TABLE_NAME] || []
        acc[result.TABLE_NAME].push(result.COLUMN_NAME)
        return acc
    }, {} as { [key: string]: string[] })

    return Object.keys(resultsByTableName)
        .map((key): DbTable => {
            return {
                name: key,
                columns: resultsByTableName[key]
            }
        })
}

export const getMysqlColumns = (db: DbProperties): Promise<DbTable[]> => {
    const connection = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.information_schema
    });
    return new Promise((resolve, reject) => {
        connection.query(
            `select *
             from information_schema.columns
             where table_schema = '${db.schema}'`,
            (err, results: MysqlResultType[]) => {

                if (err === null) {
                    log.trace("mysql results", results)
                    const tables = handleResults(results)
                    log.debug("mysql tables", tables)
                    resolve(tables)
                } else {
                    log.error("mysql error", err)
                    reject(err)
                }
            }
        );
    })
}
