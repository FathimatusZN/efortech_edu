'use client'

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState("user"); // Default role user
    const [error, setError] = useState('');
    const router = useRouter();
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.includes("@")) return setError("Please enter a valid email.");
        if (password !== confirmPassword) return setError("Passwords do not match.");

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });

            if (!res.ok) throw new Error(await res.text());

            alert("Registration successful!");
            router.push("/auth/signin");
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row -mt-16">
            <div className="relative w-full md:w-1/2 h-auto md:h-auto overflow-hidden">
                <img
                    src="/assets/Gambar2.jpg"
                    alt="Register Image"
                    className="w-full h-full object-cover object-top"
                />
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-[550px] h-[650px] space-y-6 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-[#333333] text-center">Register Form</h1>
                    <form onSubmit={handleRegister} className="border-2 border-[#03649F] rounded-[10px] p-6 space-y-5 bg-white shadow-md h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-[#333333] flex items-center">
                                    Full Name <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name here"
                                    className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] shadow-md"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-[#333333] flex items-center">
                                    Email <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] shadow-md"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-[#333333] flex items-center">
                                    Password <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] pr-12 shadow-md"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div onClick={togglePasswordVisibility} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                                        {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-[#333333] flex items-center">
                                    Confirm Password <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] pr-12 shadow-md"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <div onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                                        {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                    </div>
                                </div>
                            </div>
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            <div className="flex justify-center pt-16">
                                <button type="submit" className="bg-[#ED7117] hover:bg-orange-600 text-white font-semibold rounded-[10px] w-[180px] h-[40px] transition">
                                    Register
                                </button>
                            </div>
                            <p className="text-gray-500 text-center text-sm">
                                Already have an account?{' '}
                                <Link href="../auth/signin" className="text-[#ED7117] font-semibold hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;