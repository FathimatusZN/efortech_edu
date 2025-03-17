"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext"; // Import useAuth

const SigninPage = () => {
    const { login } = useAuth(); // Ambil fungsi login dari AuthContext
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Contoh data dummy user
        const dummyUsers = [
            { email: "user@example.com", password: "user123", role: "user" },
            { email: "admin@example.com", password: "admin123", role: "admin" },
            { email: "superadmin@example.com", password: "superadmin123", role: "superadmin" }
        ];

        // Cek apakah email & password cocok dengan dummy data
        const foundUser = dummyUsers.find(user => user.email === email && user.password === password);

        if (foundUser) {
            login(foundUser.role); // Simpan role ke AuthContext
            alert(`Login berhasil sebagai ${foundUser.role}`);
        } else {
            alert("Email atau password salah!");
        }
    };

    return (
        <div className="w-full h-screen flex flex-col md:flex-row -mt-16">
            <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden">
                <img
                    src="/assets/Gambar2.jpg"
                    alt="Signin Image"
                    className="w-full h-full object-cover object-top"
                />
            </div>

            <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6 mt-[-60]">
                    <h1 className="text-3xl font-bold text-[#333333] text-center">Sign In Form</h1>

                    <form
                        className="border-2 border-[#03649F] rounded-[10px] p-6 space-y-5 fi bg-white ml-[-50] w-[550px] h-[420px] shadow-md"
                        onSubmit={handleLogin} // Tambahkan handleLogin saat submit
                    >
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-[#333333] flex items-center">
                                Email <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email in the correct format"
                                className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] placeholder:text-[14px] shadow-md"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-[#333333] flex items-center">
                                Password <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your correct password"
                                    className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] placeholder:text-[14px] pr-12 shadow-md"
                                />
                                <div
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                >
                                    {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-12">
                            <button
                                type="submit"
                                className="bg-[#ED7117] hover:bg-orange-600 text-white font-semibold rounded-[10px] w-[180px] h-[36px] transition"
                            >
                                Sign In
                            </button>
                        </div>

                        <p className="text-gray-500 text-center text-sm">
                            Don't have an account?{" "}
                            <Link href="../auth/register" className="text-[#ED7117] font-semibold hover:underline">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
