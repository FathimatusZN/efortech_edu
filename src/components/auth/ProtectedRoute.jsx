"use client";
import { useAuth } from "@/app/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Unauthorized, Forbidden } from "@/components/ui/ErrorPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner text="Loading..." />;

    if (!user) return <Unauthorized />;
    if (!allowedRoles.includes(user.role)) return <Forbidden />;

    return children;
};

export default ProtectedRoute;
