import { readFile } from '../../src/utils/fs.utils';


export const getResourceContent = (path: string) => {
    return readFile(`./tests/resources/${path}`)
}
