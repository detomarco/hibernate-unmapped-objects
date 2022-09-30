import { readFile } from '../../src/utils/fs.utils';

export const getTestResource = (path: string): string => readFile(`./tests/resources/${path}`);
