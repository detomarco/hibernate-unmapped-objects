export const matchGroupList = (s: string, regex: RegExp): string[] => {
    const groups: string[] = [];
    for (const match of s.matchAll(regex)) {
        groups.push(match[0].trim());
    }
    return groups;
};

export const matchGroups = (s: string, regex: RegExp): { first: string | undefined, second: string } => {
    const propertyParts = s.match(regex)!;
    const first = propertyParts[1]?.trim();
    const second = propertyParts[2]?.trim();
    return { first, second };
};

export const matchGroup = (s: string, regex: RegExp): string | undefined => {
    const propertyParts = s.match(regex)!;
    if (!propertyParts) {
        return undefined;
    }
    return propertyParts[1]?.trim();
};
