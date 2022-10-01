import { DbTable } from "../database/db.model";

export type AnnotationTypeString = 'JoinColumn' | 'Column' | 'Entity' | 'Table';

export type JavaTable = DbTable & {
    filePath: string
}

export interface AnnotationAttributeEnhance {
    default: string | undefined
}

export interface NameAttributeEnhance extends AnnotationAttributeEnhance {
    name: string | undefined;
}
