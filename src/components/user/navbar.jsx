"use client";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setShowSubmenu(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowSubmenu(false);
    }, 500);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo di Paling Kiri */}
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="Logo" className="h-8 absolute left-6 top-3 flex items-center"/>
        </div>

        {/* Hamburger Menu untuk Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-mainBlue text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-8 md:space-x-12 text-mainBlue font-medium text-sm md:text-base">
          <li><a href="/" className="hover:text-mainOrange transition duration-300">Home</a></li>
          <li><a href="/training" className="hover:text-mainOrange transition duration-300">Training</a></li>

          {/* Certificate dengan Submenu */}
          <li
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a href="/certificate" className="hover:text-mainOrange transition duration-300">
              Certificate
            </a>
            {showSubmenu && (
              <ul className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-neutral1 rounded-md shadow-lg">
                <li>
                  <a href="/check-certificate" className="block px-4 py-2 text-mainBlue hover:bg-neutral2">
                    Check Certificate
                  </a>
                </li>
                <li>
                  <a href="/upload-certificate" className="block px-4 py-2 text-mainBlue hover:bg-neutral2">
                    Upload Certificate
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li><a href="/article" className="hover:text-mainOrange transition duration-300">Article</a></li>
          <li><a href="/profile" className="hover:text-mainOrange transition duration-300">Profile</a></li>
        </ul>

        {/* Menu Mobile (Hidden by default, show when isOpen is true) */}
        {isOpen && (
          <ul className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-4 flex flex-col items-center space-y-4 text-mainBlue font-medium text-sm">
            <li><a href="/" className="hover:text-mainOrange transition duration-300" onClick={() => setIsOpen(false)}>Home</a></li>
            <li><a href="/training" className="hover:text-mainOrange transition duration-300" onClick={() => setIsOpen(false)}>Training</a></li>

            {/* Certificate dengan submenu di mobile */}
            <li className="relative">
              <button 
                onClick={() => setShowSubmenu(!showSubmenu)} 
                className="hover:text-mainOrange transition duration-300"
              >
                Certificate ▼
              </button>
              {showSubmenu && (
                <ul className="mt-2 w-48 bg-white border border-neutral1 rounded-md shadow-lg">
                  <li>
                    <a href="/check-certificate" className="block px-4 py-2 text-mainBlue hover:bg-neutral2" onClick={() => setIsOpen(false)}>
                      Check Certificate
                    </a>
                  </li>
                  <li>
                    <a href="/upload-certificate" className="block px-4 py-2 text-mainBlue hover:bg-neutral2" onClick={() => setIsOpen(false)}>
                      Upload Certificate
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li><a href="/article" className="hover:text-lightBlue transition duration-300" onClick={() => setIsOpen(false)}>Article</a></li>
            <li><a href="/profile" className="hover:text-lightBlue transition duration-300" onClick={() => setIsOpen(false)}>Profile</a></li>
          </ul>
        )}

      </div>
    </nav>
  );
};

export default Navbar;