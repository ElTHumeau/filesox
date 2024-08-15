export const useStorage = () => {

    const getPath = (path: string, userPath: string, currentPath: string) => {
        currentPath === 'null' ? currentPath = '' : currentPath

        if (typeof(userPath) === 'object' || userPath === null || userPath == 'null') {
            userPath = ''
        }

        return userPath + currentPath + path
    }

    const getNewPath = (path: string, formData: string, name? : string) => {
        let isFolder = !name
        let lastFolder = path.split('/').reverse()[1]

        if (isFolder) {
            return formData === './' ? lastFolder + '/' : formData + '/' + path
        } else {
            return formData === './' ? name : formData + '/' + name
        }
    }

    return {getPath, getNewPath}
}