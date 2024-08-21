import {useAxios} from "../../config/axios.ts";
import {useQuery} from "react-query";
import {useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableNoData,
    TableRow
} from "../../components/modules/Table.tsx";
import {Pagination} from "../../components/modules/Pagination.tsx";
import {useTranslation} from "react-i18next";
import {adminSharesSchemaType} from "../../types/api/adminType.ts";
import {ButtonIcon} from "../../components/modules/Button.tsx";
import {ClipboardCopy, Share2, Trash2} from "lucide-react";
import {useModal} from "../../hooks/useModal.ts";
import {ModalDeleteShares} from "../modals/shares/ModalDeleteShare.tsx";

export function AdminShares() {
    const [page, setPage] = useState(1)
    const API = useAxios()
    const {t} = useTranslation();
    const {openModal} = useModal()

    const {data, isLoading} = useQuery(
        ['shares', page],
        async () => {
            const response = await API.get('/admin/shares?page=' + page)
            return adminSharesSchemaType.parse(response.data)
        },
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div className="px-7 py-4">
        <div className="flex items-center gap-3 mb-4">
            <Share2 className="text-indigo-500"/>
            <h1 className="text-2xl text-indigo-950 font-semibold">
                {t('title.admin.shares')}
            </h1>
        </div>

        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>{t('table.user')}</TableHeader>
                    <TableHeader>{t('table.path')}</TableHeader>
                    <TableHeader>{t('table.expired_at')}</TableHeader>
                    <TableHeader>{t('table.created_at')}</TableHeader>
                    <TableHeader>{t('table.actions')}</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {data && data.data.length > 0 ? (
                    data.data.map((share) =>
                        <TableRow key={share.id}>
                            <TableCell>{share.username}</TableCell>
                            <TableCell>{share.path}</TableCell>
                            <TableCell>{share.expired_at}</TableCell>
                            <TableCell>{share.created_at}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <ButtonIcon title="copy" onClick={() => console.log("copy copy")} svg={ClipboardCopy}/>
                                    <ButtonIcon title="delete" onClick={() => openModal(() => <ModalDeleteShares
                                        url={`/admin/shares/delete}`} shareId={share.id}/>, 'md')} svg={Trash2}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                    <TableNoData text={t('table.no_data')} colspan={8}/>
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