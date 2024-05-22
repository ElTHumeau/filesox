import axios from "axios";

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
