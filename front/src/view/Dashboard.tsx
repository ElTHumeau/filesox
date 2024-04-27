import {Dropzone} from "../components/Dropzone/Dropzone.tsx";
import {useFileStore} from "../stores/useFileStore.ts";
import {useQuery} from "react-query";
import {getAllStorage} from "../api/storageApi.ts";
import {LayoutsLists} from "./storages/LayoutsLists.tsx";
import {LayoutsGrid} from "./storages/LayoutsGrid.tsx";
import {useUserStore} from "../stores/useUserStore.ts";

export function Dashboard() {
    const {files, folders, setFiles, setFolders} = useFileStore();
    const {user} = useUserStore()

    const {isLoading} = useQuery("storage", () => getAllStorage(""),
        {
            onSuccess: (data) => {
                setFiles(data.files)
                setFolders(data.folders)
            }
        })


    if (isLoading) return <div className="flex items-center justify-center h-[87.5vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    return <div className="px-4 py-7 h-[87.5vh]">
        <Dropzone>
            {files && folders &&
                user?.layout === false ?
                <LayoutsLists files={files} folders={folders} />
                :
                <LayoutsGrid files={files} folders={folders} />
            }
        </Dropzone>
    </div>
}