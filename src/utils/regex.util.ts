import { ClassInfo } from "../scraper/scraper.model";

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

export const matchNamedGroups = <T>(s: string, regex: RegExp): T => {
    const groups = regex.exec(s)?.groups as Record<string, string>
    return Object.entries(groups)
        .filter(([key, value]) => value !== undefined)
        .reduce((acc, [key, value]) => {
            acc[key] = value.trim()
            return acc
        }, {} as any) as T
}
