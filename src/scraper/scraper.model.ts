export enum AnnotationType {
    JoinColumn = 'JoinColumn',
    Column = 'Column',
    Entity = 'Entity',
    Table = 'Table',
    Id = 'Id',
    GeneratedValue = 'GeneratedValue',
    GenericGenerator = 'GenericGenerator',
    ManyToOne = 'ManyToOne',
    Embedded = 'Embedded'
}

export interface JavaClass {
    filePath: string,
    name: string,
    parentPath: string | undefined,
    annotations: JavaAnnotation[],
    properties: ClassProperty[]
}

export interface ClassProperty {
    name: string;
    type: string;
    annotations: JavaAnnotation[]
}

export interface JavaAnnotation {
    name: AnnotationType,
    attributes: Record<string, string>
}

export interface ClassInfo {
    name: string | undefined,
    superClass: string | undefined,
    annotations: JavaAnnotation[] | undefined
}
