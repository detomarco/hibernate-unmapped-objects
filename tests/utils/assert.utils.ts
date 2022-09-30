import { readFile } from '../../src/utils/fs.utils';


interface Assert<T>{

    isEqualTo(expected: T): boolean
}

class AssertObject implements Assert<object>{
    private actual: object
    constructor(actual: object) {
        this.actual = actual;
    }

    isEqualTo(expected: object): boolean {
        return false;
    }
}

export const assertThat = (actual: object): AssertObject => {
    return new AssertObject(actual)
}
