import { MapString } from "../model/model";

export interface JavaClass {
    filePath: string,
    name: string | undefined,
    annotations: JavaAnnotation[],
    properties: ClassProperty[]
}

export interface ClassProperty {
    name: string;
    annotations: JavaAnnotation[]
}

export interface JavaAnnotation {
    name: string,
    attributes: MapString
}
