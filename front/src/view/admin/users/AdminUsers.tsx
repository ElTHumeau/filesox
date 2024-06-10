import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../components/modules/Table.tsx";
import {Pagination} from "../../../components/modules/Pagination.tsx";
import {useState} from "react";
import {useQuery} from "react-query";
import {Button, ButtonIcon} from "../../../components/modules/Button.tsx";
import {Plus, SquarePen, Trash2} from "lucide-react";
import {useModal} from "../../../hooks/useModal.ts";
import {AdminDeleteUserModal} from "./modals/AdminUserDeleteModal.tsx";
import {AdminCreateUserModal} from "./modals/AdminUserCreateModal.tsx";
import {AdminEditUserModal} from "./modals/AdminUserEditModal.tsx";
import {Pill} from "../../../components/modules/Pill.tsx";
import {useAxios} from "../../../config/axios.ts";
import {usersSchemaType} from "../../../types/api/userType.ts";
import {useTranslation} from "react-i18next";

export function AdminUsers() {
    const {openModal} = useModal()
    const API = useAxios()
    const [page, setPage] = useState(1)
    const {t} = useTranslation();

    const {data, isLoading} = useQuery(
        ['users', page],
        async () => {
            let response = await API.get('/admin/users?page=' + page)
            return usersSchemaType.parse(response.data)
        }
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div className="px-7 py-4">

        <div className="flex justify-between items-center  mb-4">
            <h1 className="text-2xl text-indigo-950 font-semibold">
                {t('title.admin.users')}
            </h1>

            <Button title="create user" color="primary" onClick={() => openModal(() => <AdminCreateUserModal/>)}>
                <Plus size={16} className="mr-2"/>
                {t('button.create')}
            </Button>
        </div>

        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>{t('table.name')}</TableHeader>
                    <TableHeader>{t('table.email')}</TableHeader>
                    <TableHeader>{t('table.permissions')}</TableHeader>
                    <TableHeader>{t('table.file_path')}</TableHeader>
                    <TableHeader>{t('table.created_at')}</TableHeader>
                    <TableHeader>{t('table.actions')}</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {data && data.data.map((user) =>
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.permissions[0] === 'Administration' ? <Pill type={"danger"}>{user.permissions}</Pill> : ''}</TableCell>
                        <TableCell>{user.file_path}</TableCell>
                        <TableCell>{user.created_at}</TableCell>
                        <TableCell height="py-2.5">
                            <div className="flex gap-2">
                                <ButtonIcon title="edit" onClick={() => openModal(() => <AdminEditUserModal user={user}/>)} svg={SquarePen}/>
                                <ButtonIcon title="delete" onClick={() => openModal(() => <AdminDeleteUserModal userId={user.id}/>, 'md')} svg={Trash2}/>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

        {data && data.total_pages > 1 &&
            <Pagination
                from={data.from}
                to={data.to}
                currentPage={data.current_page}
                totalPage={data.total_pages}
                onPageChange={(p) => {
                    setPage(p)
                }}
            />
        }
    </div>
}