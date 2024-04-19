import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/modules/Table.tsx";
import {Pagination} from "../../components/modules/Pagination.tsx";
import {useState} from "react";
import {useQuery} from "react-query";
import {getAdminLogs} from "../../api/adminApi.ts";
import {Pill} from "../../components/modules/Pill.tsx";

export function AdminLogs() {
    const [page, setPage] = useState(1)

    const {data, isLoading} = useQuery(
        ['logs', page],
        () => getAdminLogs(page),
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div className="px-7 py-4">
        <h1 className="text-2xl text-indigo-950 font-semibold mb-4">Admin Logs</h1>

        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Subject</TableHeader>
                    <TableHeader>Action</TableHeader>
                    <TableHeader>Created At</TableHeader>
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