"use client";

import { useAuth } from "@/app/context/AuthContext";
import DefaultFooter from "@/components/layout/footer";
import AdminFooter from "@/components/admin/footer";
import UserFooter from "@/components/user/footer";

const FooterWrapper = () => {
    const { user } = useAuth();

    if (!user) {
        return <DefaultFooter />;
    }

    if (user?.role === "superadmin" || user?.role === "admin") {
        return <AdminFooter />;
    }

    return <UserFooter />;
};

export default FooterWrapper;
