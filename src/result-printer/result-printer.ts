import { UnmappedObjects } from '../comparator/table-comparator.model';
import { errorRegister } from '../utils/error-register';

export const printResults = (unmappedObjects: UnmappedObjects): void => {
    console.log('Unmapped tables', unmappedObjects.unmappedTables);
    console.log('\nUnmapped columns');

    const unmappedColumnsView = Object.keys(unmappedObjects.unmappedColumns)
        .map(key => ({
                table: key,
                columns: unmappedObjects.unmappedColumns[key].join(', ')
            }));

    console.table(unmappedColumnsView);

    errorRegister.printReport();
};
