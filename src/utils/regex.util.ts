export const matchGroupList = (s: string, regex: RegExp): string[] => {
    const groups: string[] = [];
    for (const match of s.matchAll(regex)) {
        groups.push(match[0].trim());
    }
    return groups;
};

export const matchNamedGroups = <T>(s: string, regex: RegExp): T => {
    const groups = regex.exec(s)?.groups as Record<string, string> || {};
    return Object.entries(groups)
        .filter(([, value]) => value !== undefined)
        .reduce((acc, [key, value]) => {
            acc[key] = value.trim();
            return acc;
        }, {} as any) as T;
};
