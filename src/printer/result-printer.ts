import { UnmappedObjects } from '../comparator/table-comparator.model';
import { errorRegister } from '../utils/error-register';
import { ConfigProperties } from "../model/model";

export const printResults = (unmappedObjects: UnmappedObjects, config: ConfigProperties): void => {
    const unmappedTables = unmappedObjects.unmappedTables
        .filter(it => !config.ignoreTables.some(c => c == it))

    if (unmappedTables.length > 0) {
        console.log(`\n ${unmappedTables} unmapped tables detected`);
        console.log(unmappedTables);
    }

    if (Object.keys(unmappedObjects.unmappedColumns).length > 0) {
        console.log(`\n ${Object.keys(unmappedObjects.unmappedColumns).length} unmapped columns detected`);
        const unmappedColumnsView = Object.keys(unmappedObjects.unmappedColumns)
            .map(key => ({
                table: key,
                columns: unmappedObjects.unmappedColumns[key].join(', ')
            }));
        console.table(unmappedColumnsView);
    }

    if (unmappedObjects.unmappedTables.length === 0 && Object.keys(unmappedObjects.unmappedColumns).length === 0) {
        console.log('No unmapped objects have been detected. Good job! 👍');
    }

    errorRegister.printReport();
};
