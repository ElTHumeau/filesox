import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../components/modules/Table.tsx";
import {getLogsProfile} from "../../../api/profileApi.ts";
import {useQuery} from "react-query";
import {Pagination} from "../../../components/modules/Pagination.tsx";
import {useState} from "react";
import {Pill} from "../../../components/modules/Pill.tsx";

export function ProfileLog() {
    const [page , setPage] = useState(1)
    const {data, isLoading} = useQuery(
        ['logs', page],
        () => getLogsProfile(page),
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div className="px-7 py-4">
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>Subject</TableHeader>
                    <TableHeader>Action</TableHeader>
                    <TableHeader>Created At</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {data && data.data.map((log) =>
                    <TableRow key={log.id}>
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
                onPageChange={(p) => {setPage(p)}}
            />
        }
    </div>;
}