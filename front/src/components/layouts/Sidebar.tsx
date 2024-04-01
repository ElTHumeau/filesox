import {ComponentType, ReactNode} from "react";
import {Link, useLocation} from "react-router-dom";

export function Sidebar({children}: { children: ReactNode }) {
    return <>
        <aside
            className="min-h-full lg:col-span-1 sm:col-span-2 h-screen pt-20 transition-transform -translate-x-full border-r xl:translate-x-0">
            <div className="h-full pb-4 overflow-y-auto flex flex-col justify-between">
                {children}
            </div>
        </aside>
    </>
}

export function SidebarMenu({children}: { children: ReactNode }) {
    return <>
        <ol className="space-y-2 mb-12 font-medium">{children}</ol>
    </>
}

export function SidebarMenuContent({children}: { children: ReactNode }) {
    return <>
        <div>{children}</div>
    </>
}

export function SidebarTitleMenu({children}: { children: ReactNode }) {
    return <>
        <li className="pl-4 text-gray-400 text-sm mb-2">{children}</li>
    </>
}

export function SidebarMenuItem({svg: SvgComponent, children, href, onClick}: {
    svg: ComponentType<any>,
    children: ReactNode,
    href?: string,
    onClick?: (event: MouseEvent) => void | undefined
}) {
    const location = useLocation();
    const isActive = location.pathname.startsWith(href!) ? 'border-indigo-700 text-indigo-700 bg-indigo-50' : 'text-gray-600 border-transparent';

    return <>
        <li className={`${isActive}  pr-2 py-2 text-sm hover:text-indigo-700 border-l-4  hover:border-indigo-700 hover:bg-indigo-50`}>
            {href === undefined ?
                <button
                    className="flex items-center gap-2 pl-3"
                    onClick={onClick}>
                    <SvgComponent size={20} strokeWidth={1.75} />
                    {children}
                </button>
                :
                <Link to={href} className="flex items-center gap-2 pl-3">
                    <SvgComponent size={20} strokeWidth={1.75} />
                    {children}
                </Link>
            }
        </li>
    </>
}

export function SidebarItemVersion({children}: { children: ReactNode }) {
    return <>
        <li className="text-center text-gray-400 text-sm mb-2">{children}</li>
    </>
}