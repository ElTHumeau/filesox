import {useParams} from "react-router-dom";

export function ShowShare () {
    const {uuid} = useParams()

    console.log(uuid)

    return <div className="px-7 py-4">
    </div>
}