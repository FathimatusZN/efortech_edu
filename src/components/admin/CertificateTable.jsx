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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCertificateDetailDialog } from "@/components/admin/UserCertificateDetailDialog";

const PAGE_SIZE = 10;

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

const CertificateTable = ({
    data,
    mode,
    mode2,
    disablePagination = false,
}) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    return (
        <div>
            {paginatedData.length === 0 ? (
                <p>No Data Available</p>
            ) : (
                <div className="overflow-x-auto rounded-md shadow">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Certificate Number</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Issued by</TableHead>
                                <TableHead>Issued Date</TableHead>
                                <TableHead>Expired Date</TableHead>
                                <TableHead>Preview</TableHead>
                                <TableHead>Status</TableHead>
                                {mode2 === "all" && <TableHead>Type</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map(item => (
                                <TableRow key={item.certificate_id}>
                                    <TableCell>{item.certificate_number}</TableCell>
                                    <TableCell>{item.fullname}</TableCell>
                                    <TableCell>{item.certificate_title}</TableCell>
                                    <TableCell>{item.issued_by}</TableCell>
                                    <TableCell>{formatDate(item.issued_date)}</TableCell>
                                    <TableCell>{item.expired_date ? formatDate(item.expired_date) : "No Expiry Date"}</TableCell>
                                    <TableCell>
                                        <Button
                                            className="bg-white text-black hover:bg-lightBlue hover:text-white transition duration-300 ease-in-out py-2 px-4 rounded-md"
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setDialogOpen(true);
                                            }}>
                                            See Preview
                                        </Button>
                                    </TableCell>
                                    <TableCell className={`font-semibold ${item.validity_status === "Valid" ? "text-green-600" : "text-red-600"}`}>
                                        {item.validity_status}
                                    </TableCell>
                                    {mode2 === "all" && (
                                        <TableCell>
                                            {item.type === 1 ? "Training Registration" : item.type === 2 ? "User Upload" : "Unknown"}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {/* Pagination */}
            {!disablePagination && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent className="gap-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage((prev) => Math.max(prev - 1, 1));
                                    }}
                                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === i + 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(i + 1);
                                        }}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage((prev) => Math.min(prev + 1, totalPages));
                                    }}
                                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            {!disablePagination && (
                <div className="text-xs text-gray-600 text-center mt-2">
                    Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                    {Math.min(page * PAGE_SIZE, data.length)} of {data.length} data
                </div>
            )}

            <UserCertificateDetailDialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                item={selectedItem}
                mode={mode}
            />
        </div>
    );
};

export default CertificateTable;
