const fileSeparator = "/";

export const cdUp = (path: string): string => {
    const lastPath = path.lastIndexOf(fileSeparator);
    return path.substring(0, lastPath)
};

export const findFilePathFromImportPath = (filePath: string, importPath: string): string => {

    const filePathParts = filePath.split(fileSeparator)
    const importPathParts = importPath.split('\.')

    const resultParts = [];
    for (let i = 0; i < filePathParts.length; i++) {
        if (filePathParts[i] !== importPathParts[0]) {
            resultParts.push(filePathParts[i])
        } else {
            resultParts.push(...importPathParts)
            break;
        }
    }

    return resultParts.join(fileSeparator)
};
