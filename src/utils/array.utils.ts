export const removeUndefinedItems = <T>(array: (T | undefined)[]): T[] => array.filter(it => it).map(it => it!);
