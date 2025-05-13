"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCertificateDetailDialog } from "@/components/admin/UserCertificateDetailDialog";
import { NotFound } from "@/components/ui/ErrorPage";

const PAGE_SIZE = 10;

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

const CertificateTable = ({
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
}) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("q", searchTerm);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/search?${params}`);
            const result = await res.json();
            setData(result?.status === "success" ? result.data : []);
        } catch (err) {
            console.error(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    const filtered = useMemo(() => {
        return data.filter(item => {
            if (statusFilter === "All Statuses") return true;
            return item.validity_status === statusFilter;
        });
    }, [data, statusFilter]);

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    return (
        <>
            {loading && <p>Loading...</p>}
            {!loading && filtered.length === 0 && (
                <NotFound message="No certificates found." buttons={[]} />
            )}

            {!loading && filtered.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-md shadow">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Certificate Number</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Issued Date</TableHead>
                                    <TableHead>Expired Date</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map(item => (
                                    <TableRow key={item.certificate_id}>
                                        <TableCell>{item.certificate_number}</TableCell>
                                        <TableCell>{item.fullname}</TableCell>
                                        <TableCell>{formatDate(item.issued_date)}</TableCell>
                                        <TableCell>{formatDate(item.expired_date)}</TableCell>
                                        <TableCell>{item.certificate_title}</TableCell>
                                        <TableCell>
                                            <Button
                                                className="bg-white text-black hover:bg-lightBlue hover:text-white transition duration-300 ease-in-out py-2 px-4 rounded-md"
                                                onClick={() => {
                                                    setSelected(item);
                                                    setOpenDialog(true);
                                                }}>
                                                See Preview
                                            </Button>
                                        </TableCell>
                                        <TableCell className={`font-semibold ${item.validity_status === "Valid" ? "text-green-600" : "text-red-600"}`}>
                                            {item.validity_status}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === i + 1}
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}

            <UserCertificateDetailDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                item={selected}
                mode="needprocess"
            />
        </>
    );
};

export default CertificateTable;
