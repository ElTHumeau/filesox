import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/modules/Table.tsx";
import {Pagination} from "../../components/modules/Pagination.tsx";
import {useState} from "react";
import {useQuery} from "react-query";
import {Pill} from "../../components/modules/Pill.tsx";
import {useAxios} from "../../config/axios.ts";
import {adminLogsSchemaType} from "../../types/api/adminType.ts";
import {useTranslation} from "react-i18next";

export function AdminLogs() {
    const [page, setPage] = useState(1)
    const API = useAxios()
    const {t} = useTranslation();

    const {data, isLoading} = useQuery(
        ['logs', page],
        async () => {
            const response = await  API.get('/admin/logs?page=' + page)
            return adminLogsSchemaType.parse(response.data)
        },
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div className="px-7 py-4">
        <h1 className="text-2xl text-indigo-950 font-semibold mb-4">
            {t('title.admin.logs')}
        </h1>

        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>{t('table.user')}</TableHeader>
                    <TableHeader>{t('table.subject')}</TableHeader>
                    <TableHeader>{t('table.actions')}</TableHeader>
                    <TableHeader>{t('table.created_at')}</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {data && data.data.map((log) =>
                    <TableRow key={log.id}>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.subject}</TableCell>
                        <TableCell>
                            <Pill type={log.action}>{log.action}</Pill>
                        </TableCell>
                        <TableCell>{log.created_at}</TableCell>
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