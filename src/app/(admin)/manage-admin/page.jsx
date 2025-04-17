"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageTitle } from "@/components/layout/InputField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { toast } from "react-hot-toast";
import { AddAdminDialog, EditAdminDialog } from "@/components/admin/ManageAdminDialog";
import { getAdminColumns } from "./table";

export default function ManageAdmin() {
    const [adminData, setAdminData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [addNew, setAddNew] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [role, setRole] = useState("");
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [createError, setCreateError] = useState("");
    const [editError, setEditError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [editAdminData, setEditAdminData] = useState(null);

    useEffect(() => {
        refreshData();
    }, []);

    const handleEdit = (admin) => {
        setEditAdminData(admin);
        setRole(admin.role_id);
        setEditDialogOpen(true);
    };

    const columns = getAdminColumns(handleEdit);

    const table = useReactTable({
        data: adminData,
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

    const refreshData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/list`);
            const data = await res.json();
            if (res.ok) setAdminData(data.data);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleSearch = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/list`;
            if (searchQuery.trim()) url += `?name=${encodeURIComponent(searchQuery)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok && Array.isArray(data.data)) setAdminData(data.data);
            else setAdminData([]);
        } catch (err) {
            console.error("Search failed:", err);
            setAdminData([]);
        }
    };

    const handleSearchEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/search?email=${email}`);
            const data = await res.json();
            if (res.ok) setUserData(data.data);
            else setEmailError(data.message || "User not found");
        } catch {
            setEmailError("Error searching user");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async () => {
        setCreating(true);
        setCreateError("");
        if (!role) {
            setCreateError("Role is required");
            setCreating(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role_id: role }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Admin added successfully");
                setAddNew(false);
                setEmail("");
                setUserData(null);
                setRole("");
                refreshData();
            } else {
                setCreateError(data.message || "Failed to add admin");
            }
        } catch {
            setCreateError("Error creating admin");
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateAdmin = async () => {
        setEditing(true);
        setEditError("");
        if (!role) {
            setEditError("Role is required");
            setEditing(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/update/${editAdminData.admin_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ new_role_id: role }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Admin updated successfully");
                setEditDialogOpen(false);
                setEditAdminData(null);
                setRole("");
                refreshData();
            } else {
                setEditError(data.message || "Failed to edit admin");
            }
        } catch {
            setEditError("Error editing admin");
        } finally {
            setEditing(false);
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        setDeleting(true);
        setDeleteError("");
        if (!confirm("Are you sure you want to delete this admin?")) {
            setDeleting(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/delete/${adminId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Admin deleted successfully");
                setEditDialogOpen(false);
                setEditAdminData(null);
                refreshData();
            } else {
                const data = await res.json();
                setDeleteError(data.message || "Failed to delete admin");
            }
        } catch {
            setDeleteError("Error deleting admin");
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.admin_id);
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} admins?`)) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/delete-multiple`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin_ids: selectedIds }),
            });
            if (res.ok) {
                toast.success("Selected admins deleted successfully");
                refreshData();
                setSelectedRows({});
            } else {
                const data = await res.json();
                console.error("Failed to delete admins:", data.message);
            }
        } catch (err) {
            console.error("Error deleting admins:", err);
        }
    };

    const resetAddDialog = () => {
        setEmail("");
        setRole("");
        setUserData(null);
        setEmailError("");
        setCreateError("");
    };

    const resetEditDialog = () => {
        setEditAdminData(null);
        setRole("");
        setEditError("");
        setDeleteError("");
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                <div className="flex flex-wrap justify-between items-center mt-6 mb-4 gap-4">
                    <PageTitle title="Manage Admin" />
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="relative flex w-full sm:w-[330px]">
                            <Input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                                className="w-full h-[36px] pl-5 pr-10 border-2 border-mainOrange rounded-md"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-mainOrange"
                            >
                                <FaSearch className="mr-2" />
                            </button>
                        </div>

                        <Button className="bg-lightBlue text-white hover:bg-mainBlue" onClick={() => setAddNew(true)}>
                            <FaPlus className="mr-2" /> Add New
                        </Button>

                        <AddAdminDialog
                            open={addNew}
                            setOpen={setAddNew}
                            onCloseReset={resetAddDialog}
                            email={email}
                            setEmail={setEmail}
                            handleSearchEmail={handleSearchEmail}
                            loading={loading}
                            emailError={emailError}
                            userData={userData}
                            role={role}
                            setRole={setRole}
                            handleCreateAdmin={handleCreateAdmin}
                            creating={creating}
                            createError={createError}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Admin List</h3>
                    <div className="flex items-center gap-4">
                        {Object.keys(table.getState().rowSelection).length > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleDeleteSelected} className="flex items-center gap-2">
                                <FaTrash /> Delete Selected
                            </Button>
                        )}
                        <Select defaultValue="all" onValueChange={(value) => {
                            if (value === "all") setColumnFilters([]);
                            else setColumnFilters([{ id: "role_name", value }]);
                        }}>
                            <SelectTrigger className="w-[130px] bg-mainBlue text-white border-none">
                                <SelectValue placeholder="Filter Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Superadmin">Superadmin</SelectItem>
                                <SelectItem value="User">User (Inactive Admin)</SelectItem>
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
                            {adminData.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <EditAdminDialog
                    open={editDialogOpen}
                    setOpen={setEditDialogOpen}
                    onCloseReset={resetEditDialog}
                    admin={editAdminData}
                    role={role}
                    setRole={setRole}
                    handleUpdateAdmin={handleUpdateAdmin}
                    handleDeleteAdmin={handleDeleteAdmin}
                    editing={editing}
                    deleting={deleting}
                    editError={editError}
                    deleteError={deleteError}
                />

                <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                                disabled={!table.getCanPreviousPage()}
                            />
                        </PaginationItem>
                        {Array.from({ length: table.getPageCount() }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={table.getState().pagination.pageIndex === i}
                                    onClick={(e) => { e.preventDefault(); table.setPageIndex(i); }}
                                >{i + 1}</PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); table.nextPage(); }}
                                disabled={!table.getCanNextPage()}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

                <p className="text-sm text-muted-foreground mt-2 justify-end flex mr-4">
                    Showing {table.getRowModel().rows.length > 0
                        ? `${pagination.pageIndex * pagination.pageSize + 1} - ${pagination.pageIndex * pagination.pageSize + table.getRowModel().rows.length}`
                        : 0} of {adminData.length} Admin data
                </p>
            </div>
        </ProtectedRoute>
    );
}