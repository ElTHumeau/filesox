export enum FilePaths {
    path = "FILE_PATH_AUTH"
}

export function useLocalStorage() {
    const getItem = (key: string) => {
       return localStorage.getItem(key);
    }

    const setItem = (key: string, value: any) => {
        localStorage.setItem(key, value);
    }

    return {getItem, setItem};
}