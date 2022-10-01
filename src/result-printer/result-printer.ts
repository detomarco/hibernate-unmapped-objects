import { UnmappedObjects } from '../comparator/table-comparator.model';
import { errorRegister } from "../utils/error-register";
import { MapString } from "../model/model";


export const printResults = (unmappedObjects: UnmappedObjects): void => {
    console.log('\n\n');
    console.log('Unmapped tables', unmappedObjects.unmappedTables);
    console.log('\nUnmapped columns');

    const unmappedColumnsView = Object.keys(unmappedObjects.unmappedColumns)
        .map((key) => {
            return {
                table: key,
                columns: unmappedObjects.unmappedColumns[key].join(", ")
            }
        } )

    console.table(unmappedColumnsView);

    errorRegister.printReport();
};
