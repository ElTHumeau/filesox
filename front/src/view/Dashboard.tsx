import {Dropzone} from "../components/Dropzone/Dropzone.tsx";
import {useFileStore} from "../stores/useFileStore.ts";
import {useQuery} from "react-query";
import {LayoutsLists} from "./storages/LayoutsLists.tsx";
import {LayoutsGrid} from "./storages/LayoutsGrid.tsx";
import {useUserStore} from "../stores/useUserStore.ts";
import {Breadcrumb} from "../components/modules/Breadcrumb.tsx";
import {useAxios} from "../config/axios.ts";
import {useCurrentPath} from "../context/modules/CurrentPathContext.tsx";

export function Dashboard() {
    const {files, folders, setFiles, setFolders, setActiveStorage} = useFileStore();
    const {user} = useUserStore()
    let {currentPath} = useCurrentPath()
    const API = useAxios()

    const {isLoading} = useQuery(
        ["storage", currentPath],
        async () => {
            const response = await API.post("/folders", {
                path: currentPath
            })
            return response.data
        }
        ,
        {
            onSuccess: (data) => {
                setFiles(data.files)
                setFolders(data.folders)
            }
        })


    if (isLoading) return <div className="flex items-center justify-center h-[87.5vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    return <div className="px-4 py-7 h-[87.5vh]" onClick={() => setActiveStorage(null)}>
        <Dropzone>
                <Breadcrumb/>
                {files && folders &&
                user?.layout === false ?
                    <LayoutsLists files={files} folders={folders}/>
                    :
                    <LayoutsGrid files={files} folders={folders}/>
                }
        </Dropzone>
    </div>
}