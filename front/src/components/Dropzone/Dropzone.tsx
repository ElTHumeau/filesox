import {useDropzone} from "react-dropzone";
import {ReactNode, useCallback} from "react";
import './dropzone.css';
import {useFileStore} from "../../stores/useFileStore.ts";
import {useAxios} from "../../config/axios.ts";
import {useQueryClient} from "react-query";
import {FilePaths, useLocalStorage} from "../../hooks/useLocalStorage.ts";

export function Dropzone({children}: { children: ReactNode }) {
    const {setFiles} = useFileStore();
    const API = useAxios()
    const queryClient = useQueryClient()
    const {getItem} = useLocalStorage()

    const handleFileUpload = async (files: File[]) => {
        const chunkSize = 1024 * 1024 * 5; // 5MB
        const parent_id = getItem(FilePaths.id) === 'null' ? null : getItem(FilePaths.id);

        console.log(parent_id)

        for (const file of Array.from(files)) {
            const totalChunks = Math.ceil(file.size / chunkSize);

            const initResponse = await API.post("/files/upload/init", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    last_modified: file.lastModified,
                    web_relative_path: file.webkitRelativePath,
                    parent_id: parent_id,
                    total_chunks: totalChunks,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });


            const uploadResponse = initResponse.data;
            const chunks = createFileChunks(file, chunkSize);

            for (let index = 0; index < chunks.length; index++) {
                const chunk = chunks[index];
                const formData = new FormData();
                formData.append('uploadId', uploadResponse.upload_id);
                formData.append('chunkNumber', (index + 1).toString());
                formData.append('totalChunks', totalChunks.toString());
                formData.append('file', chunk, uploadResponse.filename);

                await API.post("/files/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            await API.post("/files/upload/complete", {
                upload_id: uploadResponse.upload_id,
                filename: uploadResponse.filename,
            });

            await queryClient.invalidateQueries("storage")
        }

    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        handleFileUpload(acceptedFiles);
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