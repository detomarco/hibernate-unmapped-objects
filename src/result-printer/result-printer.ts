import { UnmappedObjects } from '../comparator/table-comparator.model';
import { errorRegister } from '../utils/error-register';

export const printResults = (unmappedObjects: UnmappedObjects): void => {
    if (unmappedObjects.unmappedTables.length > 0) {
        console.log('\nUnmapped tables', unmappedObjects.unmappedTables);
    }

    if (Object.keys(unmappedObjects.unmappedColumns).length > 0) {
        console.log('\nUnmapped columns');
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
