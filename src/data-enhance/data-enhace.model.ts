export type AnnotationTypeString = 'JoinColumn' | 'Column' | 'Entity' | 'Table';

export type JavaTable = {
    filePath: string,
    name: string | undefined,
    columns: JavaColumn[]
}

export type JavaColumn = {
    name: string;
}

export interface AnnotationAttributeEnhance {
    default: string | undefined
}

export interface NameAttributeEnhance extends AnnotationAttributeEnhance {
    name: string | undefined;
}
