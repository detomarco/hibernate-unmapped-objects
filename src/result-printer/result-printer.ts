import { UnmappedObjects } from '../comparator/table-comparator.model';

export const printResults = (unmappedObjects: UnmappedObjects): void => {
    console.log('UNMAPPED TABLES', unmappedObjects.unmappedTables);
    console.log('UNMAPPED COLUMNS');
    console.table(unmappedObjects.unmappedColumns);
};
