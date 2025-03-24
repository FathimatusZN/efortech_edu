"use client";

import { useState } from "react";
import { auth, sendPasswordResetEmail } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Email is required.");
            return;
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email, {
                url: "http://localhost:3000/auth/signin",
                handleCodeInApp: true,
            });
            setMessage("Password reset email sent. Check your inbox!");
        } catch (err) {
            setError("Failed to send password reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row -mt-16">
            <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img src="/assets/Gambar2.jpg" alt="Forgot Password Image" className="w-full h-full object-cover object-top" />
            </div>

            <div className="w-full md:w-1/2 h-auto flex items-center justify-center p-4">
                <div className="w-[550px] space-y-6 mt-[-80px]">
                    <h1 className="text-3xl font-bold text-[#333333] text-center">Forgot Password</h1>

                    <form onSubmit={handleForgotPassword} className="border-2 border-[#03649F] rounded-[10px] p-6 space-y-4 bg-white shadow-md">
                        <div className="space-y-1">
                            <label className="text-lg font-semibold text-[#333333]">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] shadow-md"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-500 text-sm">{message}</p>}

                        <div className="flex justify-center pt-4">
                            <button type="submit" className="bg-[#ED7117] hover:bg-orange-600 text-white font-semibold rounded-[10px] w-[180px] h-[36px] transition" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>

                        <p className="text-gray-500 text-center text-sm">
                            Back to <span className="text-[#ED7117] font-semibold hover:underline cursor-pointer" onClick={() => router.push("/auth/signin")}>Sign In</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
