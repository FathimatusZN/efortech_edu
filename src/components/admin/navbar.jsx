"use client";

import { useState, useRef, useEffect } from "react";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null); // Create a ref for the profile menu

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const navLinks = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Training", path: "/training" },
        { name: "Validation", path: "/validation" },
        { name: "Certificate", path: "/certificate" },
        { name: "Article", path: "/article" },
        { name: "Sign In", path: "../auth/signin" },
        { name: "Logout", path: "#" },
    ];

    // Close the profile menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
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
                <div className="flex items-center">
                    <img src="/assets/logo.png" alt="Logo" className="h-8 absolute left-6 top-3 flex items-center" />
                </div>

                {/* Hamburger Icon */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-mainBlue">
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className={`hidden md:flex items-center`}>
                    <ul className="flex space-x-4 md:space-x-8 lg:space-x-16 text-mainBlue font-medium">
                        {navLinks.filter(link => link.name !== "Logout" && link.name !== "Sign In").map((link, index) => (
                            <li key={index}>
                                <a href={link.path} className="hover:text-mainGrey rd-10">{link.name}</a>
                            </li>
                        ))}
                    </ul>

                    {/* Profile Button */}
                    <div className="relative" ref={profileMenuRef}>
                        <button
                            onClick={toggleProfileMenu}
                            className="flex items-center bg-transparent text-mainBlue hover:text-lightBlue ml-8"
                        >
                            <img
                                src="/assets/admin1.png"
                                className="w-8 h-8 rounded-full mr-2 border border-lightBlue"
                            />
                            <span>Admin</span>
                        </button>
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-[10px] shadow-lg z-10">
                                <a href="#" className="block px-4 py-2 text-mainBlue rounded-[10px] hover:bg-gray-100">Logout</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 right-0 bg-white w-64 max-w-[246px] h-auto min-h-[376px] rounded-lg p-4 md:hidden shadow-md">
                    <div className="flex items-center justify-center mb-4">
                        <a href="../auth/signin" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg flex items-center whitespace-nowrap">
                            <FaUser className="mr-2" />
                            Sign In
                        </a>
                    </div>

                    <div className="border-b-2 border-gray-300 mb-4" />
                    <ul className="flex flex-col space-y-0 text-mainBlue font-medium">
                        {navLinks
                            .filter(link => link.name !== "Sign In")
                            .map((link, index) => (
                                <li key={index}>
                                    <a href={link.path} className="flex items-center hover:bg-gray-100 p-2 rounded">
                                        <span className="ml-2">{link.name}</span>
                                    </a>
                                    {index < navLinks.length - 1 && <div className="border-b border-gray-300 my-2" />}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;