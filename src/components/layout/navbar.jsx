"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

const DefaultNavbar = () => {
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Training", path: "/user/training" },
        { name: "Certificate", path: "/certificate" },
        { name: "Article", path: "/article" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white py-3 drop-shadow-[0_2px_4px_rgba(237,113,23,0.3)]">
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* Logo */}
                <img src="/assets/logo.png" alt="Logo" className="h-8" />

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-16 text-mainBlue font-medium">
                    {navLinks.map((link, index) => (
                        <Link key={index} href={link.path} className="hover:text-mainOrange">
                            {link.name}
                        </Link>
                    ))}
                    {!user && (
                        <Link href="/auth/signin" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-8 rounded-lg flex items-center whitespace-nowrap">
                            <FaUser className="mr-2" /> Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden relative" ref={mobileMenuRef}>
                    <button onClick={toggleMobileMenu} className="text-mainBlue">
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                    {isMobileMenuOpen && (
                        <div className="absolute top-12 right-0 w-56 bg-white border rounded-md shadow-lg p-4 z-10">
                            <ul className="space-y-2 text-mainBlue font-medium">
                                {navLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.path} className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                                {!user && (
                                    <li>
                                        <Link href="/auth/signin" className=" bg-orange-500 hover:bg-orange-600 hover:font-bold text-white w-full px-8 h-10 rounded-lg flex items-center justify-center">
                                            <FaUser className="mr-2" /> Sign In
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DefaultNavbar;
