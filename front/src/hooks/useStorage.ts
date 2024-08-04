export const useStorage = () => {

    const getPath = (path: string, userPath: string, currentPath: string) => {
        if (userPath === './' && currentPath === './') return path

        if (userPath === './' && currentPath !== './') {
            return currentPath + path
        }

        return userPath + currentPath + path
    }

    return {getPath}
}