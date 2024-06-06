import {useDropzone} from "react-dropzone";
import {ReactNode, useCallback} from "react";
import './dropzone.css';
import {useFileStore} from "../../stores/useFileStore.ts";
import {useAxios} from "../../config/axios.ts";
import {useQueryClient} from "react-query";

export function Dropzone({children}: { children: ReactNode }) {
    const {setFiles} = useFileStore();
    const API = useAxios()
    const queryClient = useQueryClient()

    const handleFileUpload = async (file: File) => {
        const chunkSize = 1024 * 1024 * 5; // 5 MB chunk size
        const totalChunks = Math.ceil(file.size / chunkSize);

        // initialisation de l'upload
        const initResponse = await API.post("/folders/upload/init", {
                filename: file.webkitRelativePath,
                total_chunks: totalChunks,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });


        const uploadId = initResponse.data.uploadId;
        const chunks = createFileChunks(file, chunkSize);

        for (let index = 0; index < chunks.length; index++) {
            const chunk = chunks[index];
            const formData = new FormData();
            formData.append('uploadId', uploadId.toString());
            formData.append('chunkNumber', (index + 1).toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('file', chunk, file.webkitRelativePath);

            // Assurez-vous que `mutate` est asynchrone et retourne une promesse
            await API.post("/folders/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        // Finalisation de l'upload
        await API.post("/folders/upload/complete", {
            upload_id: uploadId.toString(),
            filename: file.webkitRelativePath,
        });

        await queryClient.invalidateQueries("storage")
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(handleFileUpload);
    }, [setFiles]);

    const {getRootProps, isDragActive} = useDropzone({
        onDrop,
    });

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