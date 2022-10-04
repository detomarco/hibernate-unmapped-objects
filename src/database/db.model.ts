import { DbProperties } from '../model/model';

export type DbTable = {
    name: string,
    columns: string[]
}

export abstract class DatabaseConnection {
    abstract getTables(db: DbProperties): Promise<DbTable[]>
}
