"use client";

import { useAuth } from "@/app/context/AuthContext";
import DefaultNavbar from "@/components/layout/navbar.jsx";
import UserNavbar from "@/components/user/navbar.jsx";
import AdminNavbar from "@/components/admin/navbar.jsx";

const NavbarWrapper = () => {
    const { user } = useAuth();

    if (!user) {
        return <DefaultNavbar />;
    }

    if (user.role === "superadmin" || user.role === "admin") {
        return <AdminNavbar />;
    }

    return <UserNavbar />;
};

export default NavbarWrapper;
