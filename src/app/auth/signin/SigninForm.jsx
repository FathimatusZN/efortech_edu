"use client";

import { useState, useMemo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import funfacts from "@/components/data/funfacts";

const SigninForm = () => {
    const { login } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || null;

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        let hasError = false;

        if (!email) {
            setEmailError("Email cannot be empty.");
            hasError = true;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email format.");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Password cannot be empty.");
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);

        try {
            await login(email, password);

            if (redirect) {
                router.push(redirect);
            } else {
                // Ambil user dari sessionStorage
                const role = localStorage.getItem("role");
                router.push(role === "admin" || role === "superadmin" ? "/dashboard" : "/home");
            }
        } catch (err) {
            // Tangani error Firebase
            if (err.message.includes("auth/invalid-credential")) {
                setPasswordError("Invalid email or password.");
            } else {
                setPasswordError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setLoading2(true);
        setTimeout(() => {
            router.push("/auth/forgot-password");
        }, 1000);
    };

    const handleRedirectToRegister = async () => {
        setLoading3(true);
        setTimeout(() => {
            router.push("/auth/register");
        }, 1000);
    };

    const randomFunfact = useMemo(() => {
        const index = Math.floor(Math.random() * funfacts.length);
        return funfacts[index];
    }, [loading, loading2, loading3]);

    const inputClass = (error) => `
        w-full border rounded-[10px] px-4 py-2 shadow-md
        text-xs md:text-sm lg:text-base xl:text-lg
        focus:outline-none placeholder:text-[#D9D9D9]
        placeholder:text-[12px] md:placeholder:text-[14px] lg:placeholder:text-[15px] xl:placeholder:text-[16px] 
        ${error ? 'border-red-500' : 'border-[#03649F]'}`;

    return (
        <>
            {loading || loading2 || loading3 ? (
                <div className="w-full min-h-screen flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
                        <img
                            src="/assets/Gambar2.jpg"
                            alt="Signin Image"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex items-center justify-center md:px-8 py-10 md:py-14 xl:py-20">
                        <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] mx-auto text-center">
                            <div className="flex flex-col items-center space-y-3">
                                <LoadingSpinner
                                    text={
                                        loading
                                            ? "Signing you in..."
                                            : loading2
                                                ? "Redirecting to Forgot Password..."
                                                : "Redirecting to Register..."
                                    }
                                />
                                <div className="bg-blue-50 rounded-xl px-4 py-3 shadow-md w-full max-w-[350px] sm:max-w-xl mx-auto">
                                    <p className="text-xs sm:text-sm text-black italic text-center">
                                        💡 {randomFunfact}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full md:min-h-screen flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
                        <img
                            src="/assets/Gambar2.jpg"
                            alt="Signin Image"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-grow items-center justify-center md:px-8 pb-10 md:pb-14 xl:pb-20">
                        <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] space-y-6 mx-auto pt-6 md:pt-10 xl:pt-16">
                            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black text-center">
                                Sign In Form
                            </h1>

                            <form noValidate
                                onSubmit={handleSubmit}
                                className="border-2 border-mainBlue rounded-[10px] p-4 md:p-6 lg:p-8 xl:p-10 space-y-2 md:space-y-3 lg:space-y-3 xl:space-y-4 shadow-xl "
                            >
                                <div className="space-y-1">
                                    <div className="flex justify-between items-end">
                                        <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                                            Email <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        {emailError && (
                                            <p className="text-red-600 text-xs text-right mb-1">{emailError}</p>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        className={inputClass(emailError)}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-end">
                                        <label className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-black flex items-center">
                                            Password <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        {passwordError && (
                                            <p className="text-red-600 text-xs text-right mb-1">{passwordError}</p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className={inputClass(passwordError)}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <div onClick={togglePasswordVisibility} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                                            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                        </div>
                                    </div>

                                    <div className="flex justify-end text-xs md:text-sm lg:text-base xl:text-lg">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-mainOrange font-semibold hover:underline"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-10 md:pt-14 lg:pt-16 xl:pt-20">
                                    <Button
                                        type="submit"
                                        variant="orange"
                                        size="sm"
                                        className="w-[120px] h-8 text-xs font-semibold 
                                            md:w-[180px] md:h-[36px] md:text-sm md:font-bold 
                                            lg:w-[200px] lg:h-[40px] lg:text-base 
                                            xl:w-[220px] xl:h-[44px] xl:text-base"
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </Button>
                                </div>

                                <p className="text-gray-500 text-center text-xs md:text-sm lg:text-base xl:text-lg">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={handleRedirectToRegister}
                                        className="text-mainOrange font-semibold hover:underline"
                                    >
                                        Register
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SigninForm;
