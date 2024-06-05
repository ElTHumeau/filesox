import {FileType, FolderType} from "../../types/api/storageType.ts";
import {useFileStore} from "../../stores/useFileStore.ts";
import {LayoutModules} from "./modules/LayoutModulesImage.tsx";
import {ReactNode} from "react";
import {truncateString} from "../../hooks/useStore.ts";
import {FilePaths, useLocalStorage} from "../../hooks/useLocalStorage.ts";
import {useQueryClient} from "react-query";

export function LayoutsGrid({files, folders}: { files: FileType[] | undefined, folders: FolderType[] | undefined }) {
    const {activeStorage, setActiveStorage} = useFileStore();
    const {setItem} = useLocalStorage()
    const queryClient = useQueryClient()

    const handleDoubleClick = (folder_name: string) => {
        setItem(FilePaths.path, folder_name)
        queryClient.invalidateQueries("storage")
    }

    return <>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Folders</h1>
            <hr className="mb-4"/>

            <div className="flex flex-wrap items-center mg:grid mg:grid-cols-5 gap-5">
                {folders && folders.map((folder, index) => (
                    <div key={index}
                         tabIndex={0}
                         onClick={(e) => {
                             setActiveStorage(folder)
                             e.stopPropagation()
                         }}
                         onDoubleClick={() => {
                             handleDoubleClick(folder.name)
                         }}
                         className={`min-w-full md:min-w-72 flex gap-3 items-center px-4 py-2 rounded-lg border border-gray-200 rounded-md' ${activeStorage && activeStorage.name === folder.name ? 'bg-indigo-50 text-indigo-500 shadow-md cursor-pointer' : 'cursor-pointer shadow-md bg-white text-black'}  `}
                    >
                        <LayoutCardGrid name={folder.name} isFolder={true}>
                            <img src="images/folder-icon.png" alt="folder-icon.png" width="42" height="42"/>
                        </LayoutCardGrid>
                    </div>
                ))}
            </div>
        </div>


        <div className="mt-7">
            <h1 className="text-2xl font-bold text-gray-800">Files</h1>
            <hr className="mb-4"/>

            <div className="flex flex-wrap items-center mg:grid mg:grid-cols-5 gap-5">
                <LayoutModules files={files} layout="grid"/>
            </div>
        </div>
    </>
}

export function LayoutCardGrid({name, isFolder, size, children}: {
    name: string,
    isFolder: boolean,
    children: ReactNode
    size?: string | number,
}) {
    const {getItem} = useLocalStorage()
    const path = getItem(FilePaths.path)

    return <>
        {children}

        {!isFolder ?
            <div className="gap-3 items-center">
                <p className="truncate">{truncateString(name.replace(path ?? "", ""), 17)}</p>
                <span className="text-gray-500 text-xs">{size}</span>
            </div>
            :
            <p className="truncate">{name.replace(path ?? "", "")}</p>
        }
    </>
}