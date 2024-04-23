import {Dropzone} from "../components/Dropzone/Dropzone.tsx";
import {useFileStore} from "../stores/useFileStore.ts";

export function Dashboard() {
    const {files} = useFileStore();
    return <div className="px-4 py-7 h-[87.5vh]">
        <Dropzone>
            {files && files.map((file, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-2 mt-4 bg-white rounded-lg shadow-md">
                    <p className="text-sm text-gray-800">{file.name}</p>
                    <button className="text-sm text-red-500">Remove</button>
                </div>
            ))}
        </Dropzone>
    </div>
}