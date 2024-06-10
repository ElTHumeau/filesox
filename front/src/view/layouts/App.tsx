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
import {useTranslation} from "react-i18next";

export function App() {
    const {openModal} = useModal()
    const {logout} = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const {activeStorage} = useFileStore()
    const nav = useNavigate()
    const location = useLocation()
    const {t} = useTranslation()

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
                                    <ButtonIcon svg={Share2} title={t('tooltip.share')}
                                                onClick={() => openModal(() => <ModalShareMedia/>, "md")}/>
                                    <ButtonIcon svg={SquarePen} title={t('tooltip.rename')}
                                                onClick={() => openModal(() => <ModalEditMedia/>, "md")}/>
                                    <ButtonIcon svg={MoveUpRight} title={t('tooltip.move')}
                                                onClick={() => openModal(() => <ModalMoveMedia/>, "md")}/>
                                    <ButtonIcon svg={Trash2} title={t('tooltip.delete')}
                                                onClick={() => openModal(() => <ModalDeleteMedia/>, "md")}/>
                                    <ButtonIcon svg={Info} title={t('tooltip.information')}/>
                                </>
                            }
                            <ButtonLayout/>
                            <ButtonDownload/>
                            <ButtonIcon svg={Upload} title={t('tooltip.upload')}/>
                        </NavItem>
                    </NavItemsRight>
                </>
            </NavItems>
        </Navbar>


        <div className="flex overflow-hidden bg-white pt-16">
            <Sidebar sidebarOpen={sidebarOpen} setter={setSidebarOpen}>
                <SidebarMenuContent>
                    <SidebarMenu>
                        <SidebarTitleMenu>{t('title.nav.sub.menu')}</SidebarTitleMenu>
                        <SidebarMenuItem href="/" svg={Home}>{t('title.nav.dashboard')}</SidebarMenuItem>
                        <SidebarMenuItem svg={FolderPlus} onClick={() => openModal(() => <ModalCreateFolder/>, "md")}>
                            {t('title.nav.create_folder')}
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu>
                        <SidebarTitleMenu>{t('title.nav.profile')}</SidebarTitleMenu>
                        <SidebarMenuItem href="/profile" svg={User}>
                            {t('title.nav.profile')}
                        </SidebarMenuItem>
                        <SidebarMenuItem svg={LogOut} onClick={(e) => handleClickLogout(e)}>
                            {t('title.nav.logout')}
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu>
                        <SidebarTitleMenu>
                            {t('title.nav.sub.administration')}
                        </SidebarTitleMenu>
                        <SidebarMenuItem href="/admin/settings" svg={Settings}>
                            {t('title.nav.settings')}
                        </SidebarMenuItem>
                        <SidebarMenuItem href="/admin/users" svg={Users}>
                            {t('title.nav.users')}
                        </SidebarMenuItem>
                        <SidebarMenuItem href="/admin/shares" svg={Share2}>
                            {t('title.nav.shares')}
                        </SidebarMenuItem>
                        <SidebarMenuItem href="/admin/logs" svg={Archive}>
                            {t('title.nav.logs')}
                        </SidebarMenuItem>
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