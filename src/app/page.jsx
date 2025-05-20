"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "./(user)/home/page";

export default function Landing() {
    const [message, setMessage] = useState("Loading...");
    const router = useRouter();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/message`)
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        // Redirect to home
        router.push("/home");
    }, [router]);

    return null;
}
