"use client";
import { useAuth } from "@/app/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorPage from "@/components/ui/ErrorPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner text="Loading..." />;

    if (!user) return <ErrorPage.Unauthorized />;
    if (!allowedRoles.includes(user.role)) return <ErrorPage.Forbidden />;

    return children;
};

export default ProtectedRoute;
