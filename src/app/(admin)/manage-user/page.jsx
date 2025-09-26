"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageTitle } from "@/components/layout/InputField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FaSearch, FaTrash } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { getUserColumns } from "./table";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DetailUserDialog from "@/components/admin/DetailUserDialog";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

export default function ManageUser() {
    const [userData, setUserData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [isTableLoading, setIsTableLoading] = useState(true);
    const debounceRef = useRef(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState(null);

    const handleDetail = (user) => {
        setDetailData(user);
        setDetailOpen(true);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await refreshData(user);
            } else {
                console.warn("No user logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    const columns = getUserColumns(handleDetail);

    const table = useReactTable({
        data: userData,
        columns,
        state: { sorting, columnFilters, rowSelection: selectedRows, pagination },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onRowSelectionChange: setSelectedRows,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });

    const refreshData = async (currentUser) => {
        setIsTableLoading(true);
        try {
            const token = await getIdToken(currentUser);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) setUserData(data.data);
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setIsTableLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not logged in");
            const token = await getIdToken(currentUser);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/list`;

            if (searchQuery.trim()) {
                url += `?searchQuery=${encodeURIComponent(searchQuery)}`;
            }

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok && Array.isArray(data.data)) setUserData(data.data);
            else setUserData([]);
        } catch (err) {
            console.error("Search failed:", err);
            setUserData([]);
        }
    };

    const prevQuery = useRef("");

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (searchQuery.trim() === "") {
            if (prevQuery.current !== "") {
                handleSearch();
                prevQuery.current = "";
            }
            return;
        }

        debounceRef.current = setTimeout(() => {
            handleSearch();
            prevQuery.current = searchQuery;
        }, 1200);

        return () => clearTimeout(debounceRef.current);
    }, [searchQuery]);

    return (
        <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
            <div className="relative pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                <div className="flex flex-wrap justify-between items-center mt-6 mb-4 gap-4">
                    <PageTitle title="Manage User" />
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    </div>
                </div>

                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-semibold">User List</h3>

                    <div className="flex flex-wrap items-center gap-4">
                        {Object.keys(table.getState().rowSelection).length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 whitespace-nowrap"
                            >
                                <FaTrash /> Delete Selected
                            </Button>
                        )}

                        <div className="relative flex w-full sm:w-[330px]">
                            <Input
                                type="text"
                                placeholder="Search by name, email, or institution"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (debounceRef.current) clearTimeout(debounceRef.current);
                                        handleSearch();
                                    }
                                }}
                                className="w-full h-[36px] pl-5 pr-10 border-2 border-mainOrange rounded-md"
                            />
                            <button
                                onClick={() => {
                                    if (debounceRef.current) clearTimeout(debounceRef.current);
                                    handleSearch();
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-mainOrange"
                            >
                                <FaSearch className="mr-2" />
                            </button>
                        </div>

                        <Select
                            defaultValue="all"
                            onValueChange={(value) => {
                                if (value === "all") setColumnFilters([]);
                                else setColumnFilters([{ id: "role_desc", value }]);
                            }}
                        >
                            <SelectTrigger className="w-[130px] bg-mainBlue text-white border-none">
                                <SelectValue placeholder="Filter Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superadmin">Superadmin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isTableLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-10">
                                        <LoadingSpinner />
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center text-gray-500 py-6">
                                        No user data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    if (table.getCanPreviousPage()) table.previousPage();
                                }}
                                disabled={!table.getCanPreviousPage()}
                            />
                        </PaginationItem>

                        {(() => {
                            const pageCount = table.getPageCount();
                            const currentPage = table.getState().pagination.pageIndex;
                            const maxVisible = 5;

                            let startPage = Math.max(
                                0,
                                Math.min(
                                currentPage - Math.floor(maxVisible / 2),
                                pageCount - maxVisible
                                )
                            );
                            let endPage = Math.min(pageCount, startPage + maxVisible);

                            return Array.from({ length: endPage - startPage }, (_, i) => {
                                const page = startPage + i;
                                return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                    href="#"
                                    isActive={currentPage === page}
                                    onClick={e => {
                                        e.preventDefault();
                                        table.setPageIndex(page);
                                    }}
                                    >
                                    {page + 1}
                                    </PaginationLink>
                                </PaginationItem>
                                );
                            });
                         })()}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    if (table.getCanNextPage()) table.nextPage();
                                }}
                                disabled={!table.getCanNextPage()}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

                <p className="text-sm text-muted-foreground mt-2 justify-end flex mr-4">
                    Showing {table.getRowModel().rows.length > 0
                        ? `${pagination.pageIndex * pagination.pageSize + 1} - ${pagination.pageIndex * pagination.pageSize + table.getRowModel().rows.length}`
                        : 0} of {userData.length} User data
                </p>

                <DetailUserDialog
                    open={detailOpen}
                    setOpen={setDetailOpen}
                    user={detailData}
                />

            </div>
        </ProtectedRoute>
    );
}