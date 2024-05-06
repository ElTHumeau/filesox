import {useNavigate} from "react-router-dom";
import {useFileStore} from "../../stores/useFileStore.ts";
import {FileType, FolderType} from "../../types/api/storageType.ts";
import {ReactNode} from "react";
import {LayoutModules} from "./modules/LayoutModulesImage.tsx";

export function LayoutsLists({files, folders}: { files: FileType[], folders: FolderType[] }) {
    const nav = useNavigate()
    const {activeStorage, setActiveStorage} = useFileStore();

    return <>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Folders</h1>

            <hr/>

            {folders && folders.map((folder, index) => (
                <div key={index}
                     onClick={() => {
                         setActiveStorage(folder)
                     }}
                     onDoubleClick={() => {
                         nav('/files/' + folder.name)
                     }}
                     className={`flex items-center justify-between px-4 py-2 mt-4 rounded-lg' ${activeStorage && activeStorage.name === folder.name ? 'bg-indigo-50 text-indigo-500 shadow-md cursor-pointer' : 'cursor-pointer shadow-md bg-white text-black'}  `}
                >
                    <LayoutCardList name={folder.name} isFolders={true}>
                        <img src="images/folder-icon.png" alt="folder-icon.png" width="28" height="28"/>
                    </LayoutCardList>
                </div>
            ))}

            <LayoutModules files={files} layout="list"/>
        </div>
    </>
}

export function LayoutCardList({name, isFolders, children, size}: {
    name: string,
    isFolders: boolean,
    size?: number | string,
    children: ReactNode
}) {
    return <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
            {children}
            <p>{name}</p>
        </div>
        {!isFolders && <span className="text-gray-500 text-sm">{size}</span>}
    </div>
}