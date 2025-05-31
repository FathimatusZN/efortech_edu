"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBouncer from "@/components/ui/LoadingBouncer";

let timeout;

export default function RouteLoader() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // trigger loading when the path changes
        setLoading(true);
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div className="text-center">
                <LoadingBouncer message="Loading" />
            </div>
        </div>
    );
}
