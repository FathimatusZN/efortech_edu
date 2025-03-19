"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:5000/api/message")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error(err));
    }, []);

    return (
        <section className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-blue-600">Welcome to Efortech Edu</h1>
            <p className="mt-4 text-gray-700">{message}</p>
        </section>
    );
}
