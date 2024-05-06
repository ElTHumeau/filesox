import {FileType, FolderType} from "../../types/api/storageType.ts";
import {useFileStore} from "../../stores/useFileStore.ts";
import {Row} from "../../components/modules/Grid.tsx";
import {LayoutModules} from "./modules/LayoutModulesImage.tsx";
import {ReactNode} from "react";
import {truncateString} from "../../hooks/useStore.ts";
import {FilePaths, useLocalStorage} from "../../hooks/useLocalStorage.ts";

export function LayoutsGrid({files, folders}: { files: FileType[] | undefined, folders: FolderType[] | undefined}) {
    const {activeStorage, setActiveStorage} = useFileStore();
    const {setItem} = useLocalStorage()

    const handleDoubleClick = (folder_name: string) => {
        setItem(FilePaths.path, folder_name)
    }

    return <>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Folders</h1>
            <hr className="mb-4"/>

            <Row cols={5}>
                {folders && folders.map((folder, index) => (
                    <div key={index}
                         onClick={() => {
                             setActiveStorage(folder)
                         }}
                         onDoubleClick={() =>
                             handleDoubleClick(folder.name)
                         }
                         className={`flex gap-3 items-center px-4 py-2 rounded-lg' ${activeStorage && activeStorage.name === folder.name ? 'bg-indigo-50 text-indigo-500 shadow-md cursor-pointer' : 'cursor-pointer shadow-md bg-white text-black'}  `}
                    >
                        <LayoutCardGrid name={folder.name} isFolder={true}>
                            <img src="images/folder-icon.png" alt="folder-icon.png" width="42" height="42"/>
                        </LayoutCardGrid>
                    </div>
                ))}
            </Row>
        </div>


        <div className="mt-7">
            <h1 className="text-2xl font-bold text-gray-800">Files</h1>
            <hr className="mb-4"/>

            <Row cols={5}>
                <LayoutModules files={files} layout="grid"/>
            </Row>
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
                <p className="truncate">{truncateString(name.replace(path ?? "", ""), 20)}</p>
                <span className="text-gray-500 text-sm">{size}</span>
            </div>
            :
            <p className="truncate">{name.replace(path ?? "", "")}</p>
        }
    </>
}