export const removeUndefinedItems = <T>(array: (T | undefined)[]): T[] =>
    array.filter(it => it).map(it => 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         it!
    )
;
