"use client";

import { useState, useRef, useEffect } from "react";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

const DefaultNavbar = () => {
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

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
        <nav className="sticky top-0 z-50 bg-white py-3 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* Logo */}
                <img src="/assets/logo.png" alt="Logo" className="h-8" />

                {/* Hamburger Icon - Mobile */}
                <div className="md:hidden relative" ref={mobileMenuRef}>
                    <button onClick={toggleMobileMenu} className="text-mainBlue">
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                    {isMobileMenuOpen && (
                        <div className="absolute top-12 right-0 w-56 bg-white border rounded-md shadow-lg p-4 z-10">
                            <ul className="space-y-2 text-mainBlue font-medium">
                                {!user && (
                                    <li>
                                        <a href="/auth/signin" className="block bg-orange-500 hover:bg-orange-600 hover:font-bold text-white w-full px-8 h-10 rounded-lg flex items-center justify-center">
                                            <FaUser className="mr-2" /> Sign In
                                        </a>
                                    </li>
                                )}
                                <li><a href="/" className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">Home</a></li>
                                <li><a href="/user/training" className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">Training</a></li>
                                <li><a href="/certificate" className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">Certificate</a></li>
                                <li><a href="/article" className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">Article</a></li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-16 text-mainBlue font-medium">
                    <a href="/" className="hover:text-mainOrange">Home</a>
                    <a href="/user/training" className="hover:text-mainOrange">Training</a>
                    <a href="/certificate" className="hover:text-mainOrange">Certificate</a>
                    <a href="/article" className="hover:text-mainOrange">Article</a>
                    {!user && (
                        <a href="/auth/signin" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-8 rounded-lg flex items-center whitespace-nowrap">
                            <FaUser className="mr-2" /> Sign In
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DefaultNavbar;
