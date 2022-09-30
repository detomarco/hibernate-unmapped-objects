import { MapString } from '../model/model';

export enum AnnotationType {
    JoinColumn = 'JoinColumn',
    Column = 'Column',
    Entity = 'Entity',
    Table = 'Table',
    Id = 'Id',
    GeneratedValue = 'GeneratedValue',
    GenericGenerator = 'GenericGenerator',
    ManyToOne = 'ManyToOne'
}

export interface JavaClass {
    filePath: string,
    name: string,
    annotations: JavaAnnotation[],
    properties: ClassProperty[]
}

export interface ClassProperty {
    name: string;
    annotations: JavaAnnotation[]
}

export interface JavaAnnotation {
    name: AnnotationType,
    attributes: MapString
}
