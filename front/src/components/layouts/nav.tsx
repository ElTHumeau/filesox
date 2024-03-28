import {ReactNode} from "react";

export function Navbar({children}: {children: ReactNode}) {
    return <>
        <nav className="border-b border-gray-300">
            {children}
        </nav>
    </>
}

export function NavItems({children}: { children: ReactNode}) {
    return <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            {children}
        </div>
    </div>
}

export function NavItemsLeft({children}: {children: ReactNode}) {
    return <div className="flex gap-2 items-center">
        {children}
    </div>
}

export function NavItemsRight({children}: {children: ReactNode}) {
    return <div className="flex gap-2 items-center">
        {children}
    </div>
}

export function NavItem({children}: {children: ReactNode}) {
    return <div className="flex">
        {children}
    </div>
}