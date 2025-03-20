"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !allowedRoles.includes(user.role))) {
            router.replace("/auth/signin");
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) return <p>Loading...</p>;

    return user && allowedRoles.includes(user.role) ? children : null;
};

export default ProtectedRoute;
