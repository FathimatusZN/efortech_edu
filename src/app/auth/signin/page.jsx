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
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        let valid = true;

        if (!email) {
            setEmailError("Email cannot be empty.");
            valid = false;
        } else if (email !== "admin@example.com") {
            setEmailError("Email is not registered.");
            valid = false;
        }

        if (!password) {
            setPasswordError("Password cannot be empty.");
            valid = false;
        } else if (password !== "12345678") {
            setPasswordError("Incorrect password.");
            valid = false;
        }

        if (valid) {
            alert("Login successful!");
            setEmail("");
            setPassword("");
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row -mt-16">

            <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img
                    src="/assets/Gambar2.jpg"
                    alt="Signin Image"
                    className="w-full h-full object-cover object-top"
                />
            </div>

            <div className="w-full md:w-1/2 h-auto flex items-center justify-center p-4">
                <div className="w-[550px] space-y-6 mt-[-80px]">
                    <h1 className="text-3xl font-bold text-[#333333] text-center">Sign In Form</h1>

                    <form
                        onSubmit={handleSubmit}
                        className="border-2 border-[#03649F] rounded-[10px] p-6 space-y-4 bg-white shadow-md"
                    >

                        <div className="space-y-1">
                            <label className="text-lg font-semibold text-[#333333] flex items-center">
                                Email <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email in the correct format"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full border rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] placeholder:text-[14px] shadow-md ${
                                    emailError ? "border-red-500" : "border-[#03649F]"
                                }`}
                            />
                            <p className={`text-xs ${emailError ? "text-red-500" : "text-transparent"} min-h-[16px]`}>
                                {emailError || "."}
                            </p>
                        </div>

                        <div className="space-y-1">
                        <label className="text-lg font-semibold text-[#333333] flex items-center">
                            Password <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your correct password"
                            className={`w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] placeholder:text-[14px] pr-12 shadow-md ${
                                passwordError ? "border-red-500" : ""
                            }`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                            >
                            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                            </div>
                        </div>

                        {passwordError && <p className={`text-xs ${emailError ? "text-red-500" : "text-transparent"} min-h-[16px]`}>{passwordError}</p>}

                        <div className="flex justify-end pt-4">
                            <Link href="../auth/change-password" className="text-sm text-[#ED7117] font-semibold hover:underline">
                            Forgot Password?
                            </Link>
                        </div>
                        </div>


                        <div className="flex justify-center pt-16">
                            <button
                                type="submit"
                                className="bg-[#ED7117] hover:bg-orange-600 text-white font-semibold rounded-[10px] w-[180px] h-[36px] transition"
                            >
                                Sign In
                            </button>
                        </div>

                        <p className="text-gray-500 text-center text-sm">
                            Don't have an account?{" "}
                            <Link
                                href="../auth/register"
                                className="text-[#ED7117] font-semibold hover:underline"
                            >
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
