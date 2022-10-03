import { UnmappedObjects } from '../comparator/table-comparator.model';
import { errorRegister } from '../utils/error-register';
import { PrinterProperties } from '../model/model';

export const printResults = (unmappedObjects: UnmappedObjects, config: PrinterProperties): { unmappedTablesFound: boolean; unmappedColumnFound: boolean; errorsDetected: boolean } => {
    const unmappedTables = unmappedObjects.unmappedTables
        .filter(it => !config.ignoreTables.some(t => t === it));
    const unmappedTablesFound = unmappedTables.length > 0;
    if (unmappedTablesFound) {
        console.log(`\n ${unmappedTables.length} unmapped tables detected`);
        console.log(unmappedTables);
    }

    let unmappedColumnFound = false;
    if (Object.keys(unmappedObjects.unmappedColumns).length > 0) {

        const unmappedColumns = Object.keys(unmappedObjects.unmappedColumns)
            .map(key => {
                const unmappedColumnsView = unmappedObjects.unmappedColumns[key];
                return {
                    table: key,
                    columns: unmappedColumnsView.filter(it => !config.ignoreColumns.some(t => t === it))
                };
            })
            .filter(it => it.columns.length > 0)
            .map(it => ({
                table: it.table,
                columns: it.columns.join(', ')
            }));
        if (Object.keys(unmappedColumns).length > 0) {
            unmappedColumnFound = true;
            console.log(`\n ${Object.keys(unmappedColumns).length} unmapped columns detected`);
            console.table(unmappedColumns);
        }

    }

    if (!unmappedTablesFound && !unmappedColumnFound) {
        console.log('No unmapped objects have been detected. Good job! 👍');
    }

    const errorsDetected = errorRegister.printReport();
    return {
        unmappedTablesFound,
        unmappedColumnFound,
        errorsDetected
    };
};
