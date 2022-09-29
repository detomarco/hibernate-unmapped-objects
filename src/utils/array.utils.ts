export const removeUndefinedItems = <T>(array: (T | undefined)[]): T[] => {
    return array.filter(it => it).map(it => it!)
}
