import {API} from "../config/axios.ts";

export const getAllStorage = async (path: string) => {
    const response = await API.post("/folders", {path: path});
    return response.data;
}

export const getFileStorage = async (path: string) => {
    const response = await API.get(path, {
        responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
}