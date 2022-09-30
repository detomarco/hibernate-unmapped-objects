import { MapString } from "../model/model";

export type AnnotationTypeString = "JoinColumn" | "Column" | "Entity" | "Table";

export enum AnnotationType {
    JoinColumn = "JoinColumn",
    Column = "Column",
    Entity = "Entity",
    Table = "Table"
}

export type JavaTable = {
    filePath: string,
    name: string | undefined,
    columns: JavaColumn[]
}

export type JavaColumn = {
    name: string;
}

export type AnnotationEnhance = {
    name: AnnotationType,
    attributes: AnnotationAttributeEnhance | undefined
}

export interface AnnotationAttributeEnhance {
    default: string | undefined
}

export class NameAttributeEnhance implements AnnotationAttributeEnhance {
    default: string | undefined;
    name: string | undefined;


    constructor(obj: MapString) {
        this.default = obj.default;
        this.name = obj.name;
    }
}
