"use client";

import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

const AdminNavbar = () => {
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    let navLinks = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Training", path: "/training" },
        { name: "Validation", path: "/validation" },
        { name: "Certificate", path: "/certificate" },
        { name: "Article", path: "/article" },
        { name: "Manage Admin", path: "/manage-admin" }
    ];

    if (user?.role === "superadmin" || user?.role === "admin") {
        navLinks = navLinks.filter(link => link.path !== "/manage-admin");
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
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

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 text-mainBlue font-medium">
                    {navLinks.map((link, index) => (
                        <a key={index} href={link.path} className="hover:text-mainOrange">{link.name}</a>
                    ))}

                    {/* Profile Button */}
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={toggleProfileMenu} className="flex items-center space-x-2 hover:text-mainOrange">
                            <img src="/assets/admin1.png" className="w-8 h-8 rounded-full border border-gray-300" />
                            <span>{user?.role === "superadmin" ? "Super Admin" : "Admin"}</span>
                        </button>
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-3 w-52 bg-white border rounded-md shadow-lg z-10">
                                {user?.role === "superadmin" && (
                                    <a href="/manage-admin" className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">Manage Admin</a>
                                )}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        logout();
                                        window.location.reload();
                                    }}
                                    className="block px-4 py-2 text-mainBlue rounded-[10px] hover:bg-gray-100 hover:font-bold"
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation (Profile Button) */}
                <div className="md:hidden relative" ref={mobileMenuRef}>
                    <button onClick={toggleMobileMenu} className="flex items-center space-x-2">
                        <img src="/assets/admin1.png" className="w-8 h-8 rounded-full border border-gray-300" />
                        <span className="text-sm font-medium text-mainBlue hover:font-bold">{user?.role === "superadmin" ? "Super Admin" : "Admin"}</span>
                    </button>
                    {isMobileMenuOpen && (
                        <div className="absolute top-12 right-0 w-56 bg-white border rounded-md shadow-lg p-4 z-10">
                            <ul className="space-y-2 text-mainBlue font-medium">
                                {navLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.path} className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">{link.name}</a>
                                    </li>
                                ))}
                                {user?.role === "superadmin" && (
                                    <li>
                                        <a href="/manage-admin" className="block px-4 py-2 hover:bg-gray-100 hover:font-bold">Manage Admin</a>
                                    </li>
                                )}
                                <li>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            logout();
                                            window.location.reload();
                                        }}
                                        className="block px-4 py-2 text-mainBlue rounded-[10px] hover:bg-gray-100 hover:font-bold"
                                    >
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
