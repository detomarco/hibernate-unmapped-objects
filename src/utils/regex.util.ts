export const matchGroupMultiple = (s: string, regex: RegExp): string[] => {
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
