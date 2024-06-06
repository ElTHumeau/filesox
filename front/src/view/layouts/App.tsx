import {
    Sidebar, SidebarItemVersion, SidebarMenu, SidebarMenuContent,
    SidebarMenuItem,
    SidebarTitleMenu
} from "../../components/layouts/Sidebar.tsx";
import {
    Archive,
    FolderPlus,
    Home, Info,
    LogOut, Menu, MoveUpRight,
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
import {ModalCreateFolder} from "../modals/folders/ModalCreateFolder.tsx";
import {ModalShareMedia} from "../modals/ModalShareMedia.tsx";
import {ModalMoveMedia} from "../modals/ModalMoveMedia.tsx";
import {ModalDeleteMedia} from "../modals/ModalDeleteMedia.tsx";
import {ModalEditMedia} from "../modals/ModalEditMedia.tsx";
import {useModal} from "../../hooks/useModal.ts";
import {Modal} from "../../components/modules/Modal.tsx";
import {ButtonLayout} from "../../components/layouts/modules/ButtonLayout.tsx";
import {useFileStore} from "../../stores/useFileStore.ts";
import {useAuth} from "../../context/modules/AuthContext.tsx";
import {ButtonDownload} from "../../components/layouts/modules/ButtonDownload..tsx";
import {useState} from "react";

export function App() {
    const {openModal} = useModal()
    const {logout} = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const {activeStorage} = useFileStore()
    const nav = useNavigate()
    const location = useLocation()

    const handleClickLogout = (e: MouseEvent) => {
        e.preventDefault()
        logout()
        nav('/login')
    }

    return <div>
        <Navbar>
            <NavItems>

                <>
                    <NavItemsLeft>
                        {!sidebarOpen &&
                            <NavItem>
                                <ButtonIcon
                                    svg={Menu} title="menu burger"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="xl:hidden"
                                />
                            </NavItem>
                        }
                        <NavItem>
                            <div>
                                <img src="/logo.png" alt="Logo" height="100" width="175" className="mx-auto"/>
                            </div>
                        </NavItem>
                    </NavItemsLeft>
                    <NavItemsRight>
                        <NavItem>
                            {location.pathname === '/' && activeStorage &&
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
                            <ButtonDownload/>
                            <ButtonIcon svg={Upload} title="Upload"/>
                        </NavItem>
                    </NavItemsRight>
                </>
            </NavItems>
        </Navbar>


        <div className="flex overflow-hidden bg-white pt-16">
            <Sidebar sidebarOpen={sidebarOpen} setter={setSidebarOpen}>
                <SidebarMenuContent>
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

            <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>

            <main className="w-full relative overflow-y-auto lg:ml-64">
                <Outlet/>
            </main>
        </div>

        <Modal/>
    </div>
}