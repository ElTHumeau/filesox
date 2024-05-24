import {ButtonIcon} from "../../modules/Button.tsx";
import {Download} from "lucide-react";
import {useFileStore} from "../../../stores/useFileStore.ts";
import {useAxios} from "../../../config/axios.ts";

export function ButtonDownload() {
    const {activeStorage} = useFileStore()
    const API = useAxios()

    const handleClickDownload = async () => {
        let is_folder = activeStorage!!.name.endsWith('/');

        const response = await API.post("/folders/download", {
            path: activeStorage!.name,
            is_folder: is_folder
        }, {
            responseType: 'blob'
        });

        const url = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = activeStorage!.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    return <>
        <ButtonIcon
            svg={Download}
            title="Download"
            onClick={handleClickDownload}
        />
    </>
}