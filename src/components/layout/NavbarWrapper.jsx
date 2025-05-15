"use client";

import { useAuth } from "@/app/context/AuthContext";
import DefaultNavbar from "@/components/layout/navbar.jsx";
import UserNavbar from "@/components/user/navbar.jsx";
import AdminNavbar from "@/components/admin/navbar.jsx";

const NavbarWrapper = () => {
    const { user, loading } = useAuth();

    return (
        <>
            {!user ? (
                <DefaultNavbar />
            ) : user.role === "admin" || user.role === "superadmin" ? (
                <AdminNavbar />
            ) : (
                <UserNavbar />
            )}
        </>
    );
};

export default NavbarWrapper;
