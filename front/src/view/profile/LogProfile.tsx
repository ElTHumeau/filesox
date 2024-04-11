import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/modules/Table.tsx";

export function ProfileLog() {
    return <div className="px-7 py-4">
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>Path</TableHeader>
                    <TableHeader>Expired At</TableHeader>
                    <TableHeader>Created At</TableHeader>
                    <TableHeader>Action</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Share</TableCell>
                    <TableCell>Share</TableCell>
                    <TableCell>Share</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>;
}