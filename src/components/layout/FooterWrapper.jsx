"use client";

import { useAuth } from "@/app/context/AuthContext";
import DefaultFooter from "@/components/layout/footer";
import AdminFooter from "@/components/admin/footer";

const FooterWrapper = () => {
    const { user } = useAuth();

    if (user?.role === "superadmin" || user?.role === "admin") {
        return <AdminFooter />;
    }

    return <DefaultFooter />;
};

export default FooterWrapper;
