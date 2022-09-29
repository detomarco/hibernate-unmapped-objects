export const getGroups = (s: string, regex: RegExp): string[] => {
    const groups: string[] = []
    for (const match of s.matchAll(regex)) {
        groups.push(match[0].trim())
    }
    return groups;
}
