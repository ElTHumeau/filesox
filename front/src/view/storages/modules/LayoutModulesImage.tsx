import {useEffect, useState} from "react";
import {useFileStore} from "../../../stores/useFileStore.ts";
import {FileType} from "../../../types/api/storageType.ts";
import {LayoutCardList} from "../LayoutsLists.tsx";
import {LayoutCardGrid} from "../LayoutsGrid.tsx";
import {useAxios} from "../../../config/axios.ts";

export function LayoutModules({files, layout}: { files: FileType[] | undefined, layout: string }) {
    const API = useAxios()
    const [imageUrls, setImageUrls] = useState<{ [key: string]: any }>({});
    const {activeStorage, setActiveStorage} = useFileStore();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const urls: Record<string, any> = {};
                for (const file of files || []) {
                    if (file.icon === 'file') {
                        let response =  await API.post("/images", {
                            'path': file.image,
                        }, {
                            responseType: 'blob'
                        });

                        urls[file.image] = URL.createObjectURL(response.data);
                    }
                }
                setImageUrls(urls);
            } catch (error) {
                console.error('Error on loading file : ', error);
            }
        };

        fetchImages();
    }, [files]);

    const renderImage = (file: FileType, size: number) => {

        return <div>
            {file.icon === 'file' ? (
                <img src={imageUrls[file.image]} alt={file.name} className="object-cover"
                     width="48" height="48"/>
            ) : (
                <img src={`images/${file.icon}-icon.png`} alt="folder-icon.png" width={size} height={size}/>
            )}
        </div>
    }

    return <>
        {files ? files.map((file, index) => (
            <div
                key={index}
                onClick={() => {
                    setActiveStorage(file);
                }}
                className={`flex gap-3 w-full items-center px-4 py-2 mt-4 ${activeStorage && activeStorage.name === file.name ? 'bg-indigo-50 text-indigo-500 shadow-md cursor-pointer' : 'cursor-pointer shadow-md bg-white rounded'}`}
            >
                {layout === 'grid' ? (
                    <LayoutCardGrid name={file.name} isFolder={false} size={file.size}>
                        {renderImage(file, 48)}
                    </LayoutCardGrid>
                ) : (
                    <LayoutCardList name={file.name} isFolders={false} size={file.size}>
                        {renderImage(file, 28)}
                    </LayoutCardList>
                )}
            </div>
        )) :
        <div className="flex items-center justify-center h-[87.5vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
                il y a pas de fichier
            </div>
        </div>
        }
    </>
}