// 📁 ManageAdminDialog.jsx
// Path: src/components/admin/ManageAdminDialog.jsx

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddAdminDialog({ open, setOpen, email, setEmail, handleSearchEmail, loading, emailError, userData, role, setRole, handleCreateAdmin, creating, createError, onCloseReset }) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen && onCloseReset) onCloseReset();
            setOpen(isOpen);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Admin</DialogTitle>
                    <DialogDescription>Find user by email and assign them a role.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSearchEmail}>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="email"
                            placeholder="Enter user email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit" disabled={loading} className="bg-mainBlue text-white hover:bg-lightBlue">
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </form>

                {userData && (
                    <>
                        <div className="mt-4 space-y-4 text-sm">
                            <div className="flex py-2 hover:bg-gray-100">
                                <span className="font-semibold w-1/4">Full Name</span>
                                <span>{userData.fullname}</span>
                            </div>
                            <div className="flex py-2 hover:bg-gray-100">
                                <span className="font-semibold w-1/4">Email</span>
                                <span>{userData.email}</span>
                            </div>
                            <div className="flex py-2 hover:bg-gray-100">
                                <span className="font-semibold w-1/4">User ID</span>
                                <span>{userData.user_id}</span>
                            </div>
                            <div className="flex py-2 hover:bg-gray-100">
                                <span className="font-semibold w-1/4">Role</span>
                                <span>
                                    {{
                                        role1: "User",
                                        role2: "Admin",
                                        role3: "Superadmin"
                                    }[userData.role_id] || "Unknown"}
                                </span>
                            </div>
                        </div>

                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="role2">Admin</SelectItem>
                                <SelectItem value="role3">Superadmin</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            className="bg-lightBlue text-white hover:bg-mainBlue"
                            onClick={handleCreateAdmin}
                            disabled={creating}
                        >
                            {creating ? "Adding..." : "Confirm & Add Admin"}
                        </Button>

                        {createError && <p className="text-red-500 text-sm ">{createError}</p>}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export function EditAdminDialog({ open, setOpen, admin, role, setRole, handleUpdateAdmin, handleDeleteAdmin, editing, deleting, editError, deleteError, onCloseReset }) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen && onCloseReset) onCloseReset();
            setOpen(isOpen);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Admin</DialogTitle>
                </DialogHeader>

                {admin && (
                    <>
                        <div className="mt-4 space-y-4 text-sm">
                            <div className="flex py-2 hover:bg-gray-100">
                                <span className="font-semibold w-1/4">Full Name</span>
                                <span>{admin.fullname}</span>
                            </div>
                            <div className="flex py-2 hover:bg-gray-100">
                                <span className="font-semibold w-1/4">Email</span>
                                <span>{admin.email}</span>
                            </div>
                        </div>

                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="role2">Admin</SelectItem>
                                <SelectItem value="role3">Superadmin</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex justify-between mt-4">
                            <Button
                                className="bg-lightBlue text-white hover:bg-mainBlue"
                                onClick={handleUpdateAdmin}
                                disabled={editing}
                            >
                                {editing ? "Updating..." : "Update Admin"}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDeleteAdmin(admin.admin_id)}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete Admin"}
                            </Button>
                        </div>

                        {editError && <p className="text-red-500 text-sm mt-2">{editError}</p>}
                        {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}