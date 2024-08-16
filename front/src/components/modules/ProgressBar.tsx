import {useProgressBar} from "../../stores/useProgressBar.ts";

export default function ProgressBar() {
    const {value} = useProgressBar()

    return <>
        <div className="z-50 absolute inset-0 p-0 -mt-3 w-full">
            <progress className="w-full bg-indigo-500 h-2" value={value} max="100"></progress>
        </div>
    </>
}