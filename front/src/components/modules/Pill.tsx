import {ReactNode} from "react";

export function Pill({children, type} : {children: ReactNode, type: string}) {
    const className = getClass(type)

    return <button
        className={`${className} px-2 py-0.5 rounded border`}
    >
        {children}
    </button>
}

function getClass(type: string) {
    if (type === 'info') {
        return 'bg-indigo-100 text-indigo-800'
    } else if (type === 'danger'  || type === "delete") {
        return 'bg-red-100 text-red-500 border-red-300'
    } else if (type === 'success' || type === "create") {
        return 'bg-green-100 text-green-500 border-green-300'
    } else if (type === 'warning' || type === "update") {
        return 'bg-yellow-100 text-yellow-500 border-yellow-300'
    } else {
        return 'bg-gray-100 text-gray-800'
    }
}