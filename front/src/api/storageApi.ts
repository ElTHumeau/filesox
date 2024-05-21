import axios from "axios";

export const getAllStorage = async (path: string) => {
    const response = await axios.post("/folders", {path: path});
    return response.data;
}

export const getFileStorage = async (filename: string) => {
    const response = await axios.post("/images", {
        'path': filename,
    },{
        responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
}

export const downloadFileStorage = async (file: string) => {
    const response = await axios.post("/folders/download", {
        path: file,
        is_folder: false
    }, {
        responseType: 'blob'
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

export function postCreateFolder({path}: { path: string}) {
    return axios.post("/folders/create", {path: path});
}

export function postDeleteFolder({path}: { path: string}) {
    return axios.post("/folders/delete", {path: path});
}