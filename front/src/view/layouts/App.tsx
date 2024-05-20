import {
    Sidebar, SidebarItemVersion, SidebarMenu, SidebarMenuContent,
    SidebarMenuItem,
    SidebarTitleMenu
} from "../../components/layouts/Sidebar.tsx";
import {
    Archive, Download,
    FolderPlus,
    Home, Info,
    LogOut, MoveUpRight, Search,
    Settings,
    Share2,
    SquarePen,
    Trash2,
    Upload,
    User,
    Users
} from "lucide-react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Navbar, NavItem, NavItems, NavItemsLeft, NavItemsRight} from "../../components/layouts/nav.tsx";
import {ButtonIcon} from "../../components/modules/Button.tsx";
import {InputIcon} from "../../components/modules/Form.tsx";
import {ModalCreateFolder} from "../modals/folders/ModalCreateFolder.tsx";
import {ModalShareMedia} from "../modals/ModalShareMedia.tsx";
import {ModalMoveMedia} from "../modals/ModalMoveMedia.tsx";
import {ModalDeleteMedia} from "../modals/ModalDeleteMedia.tsx";
import {ModalEditMedia} from "../modals/ModalEditMedia.tsx";
import {useModal} from "../../hooks/useModal.ts";
import {AlertsFlash} from "./modules/AlertsFlash.tsx";
import {Modal} from "../../components/modules/Modal.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {ButtonLayout} from "../../components/layouts/ButtonLayout.tsx";
import {useFileStore} from "../../stores/useFileStore.ts";
import {downloadFileStorage} from "../../api/storageApi.ts";

export function App() {
    const {openModal} = useModal()
    const {logout} = useAuth()
    const {activeStorage} = useFileStore()
    const nav = useNavigate()
    const location = useLocation()

    const handleClickLogout = (e: MouseEvent) => {
        e.preventDefault()
        logout()
        nav('/login')
    }

    const handleClickDownload = () => {
        downloadFileStorage(activeStorage!.name)
    }

    return <div className="grid grid-cols-8">
        <Sidebar>
            <SidebarMenuContent>
                <div className="p-4">
                    <img src="/logo.png" alt="Logo" height="100" width="175" className="mx-auto"/>
                </div>
                <SidebarMenu>
                    <SidebarTitleMenu>Menu</SidebarTitleMenu>
                    <SidebarMenuItem href="/" svg={Home}>Dashboard</SidebarMenuItem>
                    <SidebarMenuItem svg={FolderPlus} onClick={() => openModal(() => <ModalCreateFolder/>, "md")}>Create
                        folder</SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarTitleMenu>Profile</SidebarTitleMenu>
                    <SidebarMenuItem href="/profile" svg={User}>Profile</SidebarMenuItem>
                    <SidebarMenuItem svg={LogOut} onClick={(e) => handleClickLogout(e)}>Logout</SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarTitleMenu>Administration</SidebarTitleMenu>
                    <SidebarMenuItem href="/admin/settings" svg={Settings}>Settings</SidebarMenuItem>
                    <SidebarMenuItem href="/admin/users" svg={Users}>Users</SidebarMenuItem>
                    <SidebarMenuItem href="/admin/shares" svg={Share2}>Shares</SidebarMenuItem>
                    <SidebarMenuItem href="/admin/logs" svg={Archive}>Logs</SidebarMenuItem>
                </SidebarMenu>
            </SidebarMenuContent>
            <SidebarMenuContent>
                <SidebarItemVersion>v 1.0.8</SidebarItemVersion>
            </SidebarMenuContent>
        </Sidebar>
        <main className="lg:col-span-7 sm:col-span-6 xs:col-span-8 ">
            <Navbar>

                <NavItems>
                    {location.pathname === '/' && (
                        <>
                            <NavItemsLeft>
                                <NavItem>
                                    <InputIcon svg={Search}/>
                                </NavItem>
                            </NavItemsLeft>
                            <NavItemsRight>
                                <NavItem>
                                    {activeStorage &&
                                        <>
                                            <ButtonIcon svg={Share2} title="Share"
                                                        onClick={() => openModal(() => <ModalShareMedia/>, "md")}/>
                                            <ButtonIcon svg={SquarePen} title="Rename"
                                                        onClick={() => openModal(() => <ModalEditMedia/>, "md")}/>
                                            <ButtonIcon svg={MoveUpRight} title="Move to file"
                                                        onClick={() => openModal(() => <ModalMoveMedia/>, "md")}/>
                                            <ButtonIcon svg={Trash2} title="Delete"
                                                        onClick={() => openModal(() => <ModalDeleteMedia/>, "md")}/>
                                            <ButtonIcon svg={Info} title="Information"/>
                                        </>
                                    }
                                    <ButtonLayout/>
                                    <ButtonIcon
                                        svg={Download}
                                        onClick={() => handleClickDownload()}
                                        title="Download"
                                    />
                                    <ButtonIcon svg={Upload} title="Upload"/>
                                </NavItem>
                            </NavItemsRight>
                        </>
                    )}
                </NavItems>
            </Navbar>

            <div>
                <Outlet/>
                <AlertsFlash/>
            </div>
        </main>

        <Modal/>
    </div>
}