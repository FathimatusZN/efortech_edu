"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const DefaultNavbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [menuState, setMenuState] = useState({
    mobile: false,
    certificate: false,
  });

  const refs = {
    mobile: useRef(null),
    mobileButton: useRef(null),
    certificate: useRef(null),
  };

  const toggleMenu = (menuKey) => {
    setMenuState((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const closeAllMenus = () => {
    setMenuState({
      mobile: false,
      certificate: false,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      for (const [key, ref] of Object.entries(refs)) {
        if (ref.current && !ref.current.contains(event.target)) {
          setMenuState((prev) => ({ ...prev, [key]: false }));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      closeAllMenus();
    };
    router.events?.on("routeChangeStart", handleRouteChange);
    return () => router.events?.off("routeChangeStart", handleRouteChange);
  }, [router]);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Training", path: "/training" },
    {
      name: "Certificate",
      path: "#",
      subMenu: [
        { name: "Check Certificate", path: "/certificate/check" },
        { name: "Upload Certificate", path: "/certificate/upload" },
      ],
    },
    { name: "Article", path: "/article" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white py-3 drop-shadow-[0_2px_4px_rgba(237,113,23,0.3)]">
      <div className="container mx-auto flex justify-between items-center px-6">
        <img src="/assets/logo.png" alt="Logo" className="h-8" />

        <div className="hidden md:flex items-center space-x-8 text-mainBlue font-medium">
          {navLinks.map((link, index) => {
            const isActiveLink =
              pathname === link.path ||
              (link.subMenu &&
                link.subMenu.some((sub) => pathname === sub.path));
            const isMenuOpen = menuState.certificate;

            return (
              <div
                key={index}
                className="relative"
                ref={link.name === "Certificate" ? refs.certificate : null}
              >
                {link.subMenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu("certificate")}
                      className={`flex items-center gap-1 ${
                        isActiveLink || isMenuOpen
                          ? "text-mainOrange font-semibold"
                          : "hover:text-mainOrange"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute top-10 left-0 bg-white border rounded-md shadow-lg w-48 z-10">
                        {link.subMenu.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.path}
                            className={`block px-4 py-2 hover:bg-gray-100 ${
                              pathname === sub.path
                                ? "text-mainOrange font-semibold"
                                : ""
                            }`}
                            onClick={closeAllMenus}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.path}
                    className={`hover:text-mainOrange ${
                      pathname === link.path
                        ? "text-mainOrange font-semibold"
                        : ""
                    }`}
                    onClick={closeAllMenus}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            );
          })}

          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-mainOrange hover:bg-orange-600 text-white rounded-md font-semibold"
          >
            Sign In
          </Link>
        </div>

        <div className="md:hidden relative" ref={refs.mobileButton}>
          <button
            onClick={() => toggleMenu("mobile")}
            className="text-mainBlue focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {menuState.mobile && (
            <div
              className="absolute top-12 right-0 w-64 bg-white border rounded-md shadow-lg p-4"
              ref={refs.mobile}
            >
              <ul className="space-y-2 text-mainBlue font-medium">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    {link.subMenu ? (
                      <>
                        <button
                          onClick={() => toggleMenu("certificate")}
                          className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                        >
                          {link.name}
                        </button>
                        {menuState.certificate && (
                          <div className="ml-6 mt-1 space-y-1">
                            {link.subMenu.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.path}
                                className="block px-2 py-1 hover:bg-gray-100 rounded"
                                onClick={closeAllMenus}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={link.path}
                        className="block px-2 py-1 hover:bg-gray-100 rounded"
                        onClick={closeAllMenus}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
                <li className="border-t pt-2">
                  <Link
                    href="/auth/signin"
                    className="block px-2 py-1 text-mainOrange hover:bg-gray-100 rounded w-full text-left"
                    onClick={closeAllMenus}
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DefaultNavbar;
