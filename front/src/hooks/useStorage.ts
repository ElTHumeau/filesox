export const useStorage = () => {

    const getPath = (path: string, userPath: string, currentPath: string) => {
        currentPath === 'null' ? currentPath = '' : currentPath

        if (typeof(userPath) === 'object' || userPath === null || userPath == 'null') {
            userPath = ''
        }

        return userPath + currentPath + path
    }

    return {getPath}
}