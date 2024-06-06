import {Home} from "lucide-react";
import {ReactNode} from "react";
import {useQueryClient} from "react-query";
import {useUserStore} from "../../stores/useUserStore.ts";
import {useCurrentPath} from "../../context/modules/CurrentPathContext.tsx";

export function Breadcrumb() {
    const {user} = useUserStore()
    const {currentPath} = useCurrentPath()
    const pathnames = currentPath?.split("/").filter((x: string) => x) ?? []

    return <div className="mb-8">
        <div className="flex items-center gap-3">
            <BreadcrumbItem to={user!.file_path} active={currentPath !== user!.file_path}>
                <Home strokeWidth={1.5} size={20}/>
                Home
            </BreadcrumbItem>

            {currentPath !== '/' &&
                <BreadcrumbSeparator/>
            }

            {pathnames.map((name, index) =>
                <div key={index} className="flex gap-3">
                    <BreadcrumbItem
                        key={index}
                        to={`${pathnames.slice(0, index + 1).join("/")}`}
                        active={index === pathnames.length - 2}
                    >
                        {name !== '.' ? name : ''}
                    </BreadcrumbItem>
                    {index < pathnames.length - 1 && <BreadcrumbSeparator/>}
                </div>
            )}
        </div>

    </div>
}

function BreadcrumbSeparator() {
    return <span className="text-gray-600">/</span>
}

function BreadcrumbItem({to, active, children}: { to: string, active: boolean, children: ReactNode }) {
    const queryClient = useQueryClient()
    const {setPath} = useCurrentPath()

    const handleSetItem = () => {
        setPath( to === './' ? '' : to + '/')
        queryClient.invalidateQueries("storage")
    }

    return <>
        <div
            className={`flex items-center gap-3 text-sm text-gray-600 ${active ? 'hover:text-indigo-500 cursor-pointer' : 'hover:text-gray-800'}`}
            { ...(active ? {onClick: handleSetItem} : {})}
        >
                {children}
        </div>
    </>
}
