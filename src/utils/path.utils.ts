const fileSeparator = "/";

export const cdUp = (path: string): string => {
    const lastPath = path.lastIndexOf(fileSeparator);
    return path.substring(0, lastPath)
};

export const findFilePathFromImportPath = (filePath: string, importPath: string): string | undefined => {

    const filePathParts = filePath.split(fileSeparator)
    const importPathParts = importPath.split('\.')

    let found = false;
    const resultParts = [];
    for (let i = 0; i < filePathParts.length; i++) {
        if (filePathParts[i] !== importPathParts[0]) {
            resultParts.push(filePathParts[i])
        } else {
            resultParts.push(...importPathParts)
            found = true;
            break;
        }
    }

    return found ? resultParts.join(fileSeparator) : undefined
};
