export const matchGroupMultiple = (s: string | undefined, regex: RegExp): string[] => {
    if (s === undefined) {
        return [];
    }
    const groups: string[] = [];
    for (const match of s.matchAll(regex)) {
        groups.push(match[0].trim());
    }
    return groups;
};

export const matchGroups = (s: string, regex: RegExp): { first: string | undefined, second: string } | undefined => {
    if (s === undefined) {
        return undefined;
    }
    const propertyParts = s.match(regex);
    if (propertyParts) {
        const first = propertyParts[1]?.trim();
        const second = propertyParts[2]?.trim();
        return { first, second };
    }
    return undefined;
};
