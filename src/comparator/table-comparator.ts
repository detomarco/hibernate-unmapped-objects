import { DbTable } from '../database/db.model';
import { JavaTable } from '../data-enhance/data-enhace.model';
import { UnmappedObjects } from './table-comparator.model';

export const compare = (dbTables: DbTable[], javaTables: JavaTable[]): UnmappedObjects => {

    const results: UnmappedObjects = {
        unmappedTables: [],
        unmappedColumns: {}
    };

    dbTables.forEach(dbTable => {
        const javaTable = javaTables.find(it => it.name.toLowerCase() === dbTable.name.toLowerCase());
        if (javaTable === undefined) {
            results.unmappedTables.push(dbTable.name);
        } else {
            const unmappedColumns = dbTable.columns
                .filter(dbColumn => !javaTable.columns.find(it => it.toLowerCase() === dbColumn.toLowerCase()));
            if (unmappedColumns.length > 0) {
                results.unmappedColumns[javaTable.name] = unmappedColumns;
            }
        }
    });

    return results;
};
