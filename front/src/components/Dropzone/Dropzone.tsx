import {useDropzone} from "react-dropzone";
import {ReactNode, useCallback} from "react";
import './dropzone.css';
import {useFileStore} from "../../stores/useFileStore.ts";
import {useMutation} from "react-query";
import {useAxios} from "../../config/axios.ts";

export function Dropzone({children}: { children: ReactNode }) {
    const {setFiles} = useFileStore();
    const API = useAxios()

    // Hook de mutation pour l'envoi multipart
    const {mutate} = useMutation(async (formData: FormData) => {
        const response = await API.post("/folders/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    });

    const handleFileUpload = async (file: File) => {
        const chunkSize = 1024 * 1024 * 5; // 5 MB chunk size
        const totalChunks = Math.ceil(file.size / chunkSize);

        // initialisation de l'upload
        const initResponse = await API.post("/folders/upload/init", {
                filename: file.name,
                //totalChunks,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });

        console.log(initResponse.data.uploadId)

        const uploadId = initResponse.data.uploadId;
        const chunks = createFileChunks(file, chunkSize);

        chunks.forEach((chunk, index) => {
            const formData = new FormData();
            formData.append('uploadId', uploadId.toString());
            formData.append('chunkNumber', (index + 1).toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('file', chunk, file.name);

            console.log(formData);

            mutate(formData);
        });

        // Finalisation de l'upload
        await API.post("/folders/upload/complete", {
            upload_id: uploadId.toString(),
            filename: file.name,
        });
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(handleFileUpload);
    }, [setFiles]);

    const {getRootProps, isDragActive} = useDropzone({onDrop});

    return (
        <div {...getRootProps()} className={`relative cols-span-3 px-6 h-full`}>

            {children}

            <div className={`dropzone__file ${isDragActive ? 'active' : ''}`}></div>
        </div>
    );
}

function createFileChunks(file: File, chunkSize: number) {
    const chunks: Blob[] = [];
    let offset = 0;

    while (offset < file.size) {
        chunks.push(file.slice(offset, offset + chunkSize));
        offset += chunkSize;
    }

    return chunks;
}