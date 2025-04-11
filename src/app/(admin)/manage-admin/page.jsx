"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageTitle } from "@/components/layout/InputField";
import React, { useEffect, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";

export default function ManageAdmin() {
    const [adminData, setAdminData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: itemsPerPage,
    });

    {/* Fetch admin data from the backend when the component mounts */ }
    useEffect(() => {
        fetch("http://localhost:5000/api/manageadmin/list")
            .then((res) => res.json())
            .then((data) => setAdminData(data))
            .catch((err) => console.error("Error fetching admin data:", err));
    }, []);

    {/* Define columns for the table */ }
    const columns = [
        // Checkbox selector
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },

        // Name
        {
            accessorKey: "fullname",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },

        // Email
        {
            accessorKey: "email",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },

        // Last Updated
        {
            accessorKey: "last_updated",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ getValue }) => getValue()
        },

        // Last Login
        {
            accessorKey: "last_login",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ getValue }) => getValue()
        },

        // Role
        {
            accessorKey: "role_name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },

        // Status
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span
                    className={`text-sm font-medium ${row.original.status === "active"
                        ? "text-green-600"
                        : "text-red-500"
                        }`}
                >
                    {row.original.status}
                </span>
            ),
        },

        // Action
        {
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(row.original.admin_id)}
                >
                    Edit
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: adminData,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection: selectedRows,
            pagination,
        },
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


    const handleSearch = async () => {
        try {
            setColumnFilters([]); // clear previous filters
            const res = await fetch(`http://localhost:5000/api/manageadmin/search?q=${searchQuery}`);
            const data = await res.json();
            setAdminData(data);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.admin_id);

        if (selectedIds.length === 0) return;

        if (!confirm(`Are you sure you want to delete ${selectedIds.length} admins?`)) return;

        try {
            const res = await fetch("/api/admins/delete-multiple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ admin_ids: selectedIds }),
            });

            if (res.ok) {
                setAdminData(prev =>
                    prev.filter(admin => !selectedIds.includes(admin.admin_id))
                );
                setSelectedRows({});
            } else {
                console.error("Failed to delete admins");
            }
        } catch (err) {
            console.error("Error deleting admins:", err);
        }
    };

    const handleEdit = (id) => {
        console.log("Edit admin with ID:", id);
        // bisa diarahkan ke halaman edit nantinya
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">

                {/* Header: Title + Add + Search */}
                <div className="flex flex-wrap justify-between items-center mt-6 mb-4 gap-4">
                    <PageTitle title="Manage Admin" />
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        {/* Search Bar */}
                        <div className="relative flex w-full sm:w-[330px]">
                            <Input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }}
                                className="w-full h-[36px] pl-5 pr-10 border-2 border-mainOrange rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-mainOrange"
                            >
                                <FaSearch className="mr-2" />
                            </button>
                        </div>

                        <Button
                            className="bg-lightBlue text-white hover:bg-mainBlue"
                            onClick={() => window.location.href = "/manage-admin/add"}
                        >
                            <FaPlus className="mr-2" />
                            Add New
                        </Button>
                    </div>
                </div>

                {/* Filter + Delete Row */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Admin List</h3>
                    <div className="flex items-center gap-4">
                        {Object.keys(table.getState().rowSelection).length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2"
                            >
                                <FaTrash />
                                Delete Selected
                            </Button>
                        )}
                        <Select
                            defaultValue="all"
                            onValueChange={(value) => {
                                if (value === "all") setColumnFilters([]);
                                else setColumnFilters([{ id: "role_name", value }]);
                            }}
                        >
                            <SelectTrigger className="w-[130px] bg-mainBlue text-white border-none focus:ring-0">
                                <SelectValue placeholder="Filter Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="role2">Admin</SelectItem>
                                <SelectItem value="role3">Superadmin</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-md overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.previousPage();
                                }}
                                disabled={!table.getCanPreviousPage()}
                            />
                        </PaginationItem>

                        {/* Render halaman berdasarkan jumlah total pages */}
                        {Array.from({ length: table.getPageCount() }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={table.getState().pagination.pageIndex === i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        table.setPageIndex(i);
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
                                    table.nextPage();
                                }}
                                disabled={!table.getCanNextPage()}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

                <p className="text-sm text-muted-foreground mt-2 justify-end flex mr-4">
                    Showing {table.getRowModel().rows.length > 0
                        ? `${pagination.pageIndex * pagination.pageSize + 1} - ${pagination.pageIndex * pagination.pageSize + table.getRowModel().rows.length}`
                        : 0
                    } of {adminData.length} Admin data
                </p>

            </div>
        </ProtectedRoute>
    );
}
