import {useFileStore} from "../../stores/useFileStore.ts";
import {FileType, FolderType} from "../../types/api/storageType.ts";
import {ReactNode} from "react";
import {LayoutModules} from "./modules/LayoutModulesImage.tsx";
import {FilePaths, useLocalStorage} from "../../hooks/useLocalStorage.ts";

export function LayoutsLists({files, folders}: { files: FileType[], folders: FolderType[] }) {
    const {activeStorage, setActiveStorage} = useFileStore();
    const {setItem} = useLocalStorage()

    const handleDoubleClick = (folder_name: string) => {
        setItem(FilePaths.path, folder_name)
    }

    return <>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Folders</h1>

            <hr/>

            {folders && folders.map((folder, index) => (
                <div key={index}
                     onClick={() => setActiveStorage(folder)}
                     onDoubleClick={() => handleDoubleClick(folder.name)}
                     className={`flex items-center justify-between px-4 py-8 min-h-12 max-h-12 mt-4 rounded-lg border border-gray-200 rounded-md' ${activeStorage && activeStorage.name === folder.name ? 'bg-indigo-50 text-indigo-500 shadow-md cursor-pointer' : 'cursor-pointer shadow-md bg-white text-black'}  `}
                >
                    <LayoutCardList name={folder.name} isFolders={true}>
                        <img src="images/folder-icon.png" alt="folder-icon.png" width="36" height="36"/>
                    </LayoutCardList>
                </div>
            ))}

            <div className="space-y-3 mt-3">
                <LayoutModules file={files} layout="list"/>
            </div>
        </div>
    </>
}

export function LayoutCardList({name, isFolders, children, size}: {
    name: string,
    isFolders: boolean,
    size?: number | string,
    children: ReactNode
}) {
    const {getItem} = useLocalStorage()
    const path = getItem(FilePaths.path)

    return <div className="flex justify-between items-center w-full min-h-12 max-h-12">
        <div className="flex items-center gap-3">
            {children}
            <p>{name.replace(path ?? "", "")}</p>
        </div>
        {!isFolders && <span className="text-gray-500 text-sm">{size}</span>}
    </div>
}