"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrainingCard({ training }) {
    const router = useRouter();
    const descriptionRef = useRef(null);
    const [descHeight, setDescHeight] = useState(0);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (hovered && descriptionRef.current) {
            const height = descriptionRef.current.offsetHeight;
            setDescHeight(height + 16); // tambahkan padding
        }
    }, [hovered]);

    const getShortDescription = (text, maxChars = 300) => {
        return text.length > maxChars
            ? text.slice(0, maxChars).trimEnd() + "..."
            : text;
    };

    return (
        <div
            className="relative group overflow-hidden rounded-lg shadow-lg w-full max-w-[400px] aspect-[4/3] mx-auto transition-all duration-500 ease-in-out cursor-pointer"
            onClick={() => router.push(`/training/${training.training_id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* 🔥 Diskon */}
            {training.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-[2px] rounded-full shadow-md animate-bounce z-20">
                    🔥 {Math.floor(training.discount)}% OFF
                </div>
            )}

            {/* Gambar */}
            <img
                src={
                    training.images?.[0] ||
                    "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg"
                }
                alt={training.training_name}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:blur-sm"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* Nama training */}
            <h3
                className="absolute left-4 right-4 text-white font-semibold text-lg bottom-4 z-10 transition-all duration-500"
                style={{
                    transform: hovered ? `translateY(-${descHeight}px)` : "translateY(0)",
                }}
            >
                {training.training_name}
            </h3>

            {/* Deskripsi */}
            <p
                ref={descriptionRef}
                className={`absolute left-4 right-4 text-white text-sm transition-all duration-500 z-0 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                style={{ bottom: "1rem" }}
            >
                {getShortDescription(training.description, 300)}
            </p>
        </div>
    );
}
