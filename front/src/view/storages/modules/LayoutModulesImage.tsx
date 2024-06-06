import {useEffect, useState} from "react";
import {FileType} from "../../../types/api/storageType.ts";
import {useAxios} from "../../../config/axios.ts";

export function LayoutModules({file}: { file: FileType }) {
    const API = useAxios()
    const [imageUrl, setImageUrl] = useState<{ [key: string]: any }>({});

    useEffect(() => {
            const fetchImages = async () => {
                try {
                    const urls: Record<string, any> = {};
                    if (file.icon === 'file') {
                        let response = await API.post("/images", {
                            'path': file.image,
                        }, {
                            responseType: 'blob'
                        });

                        urls[file.image] = URL.createObjectURL(response.data);
                    }

                    setImageUrl(urls);
                } catch (error) {
                    console.error('Error on loading file : ', error);
                }
            }

            fetchImages();
        }, [file]
    )


    return <div>
        {file.icon === 'file' ? (
            <img
                src={`${imageUrl[file.image]}`}
                alt={file.name}
                className="object-cover"
                width="48"
                height="48"
            />
        ) : (
            <img src={`images/${file.icon}-icon.png`} alt="folder-icon.png" width={48} height={48}/>
        )}
    </div>
}