"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { ChevronDown } from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";

const AdminNavbar = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [menuState, setMenuState] = useState({
    profile: false,
    mobile: false,
    userSubmenu: false,
  });

  const refs = {
    profile: useRef(null),
    mobile: useRef(null),
    mobileButton: useRef(null),
    validation: false,
    validation: useRef(null),
  };

  const toggleMenu = (menuKey) => {
    setMenuState((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const closeAllMenus = () => {
    setMenuState({
      profile: false,
      mobile: false,
      userSubmenu: false,
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

  const getDisplayName = (fullname) => {
    if (!fullname) return "User";
    const words = fullname.trim().split(" ");
    let result = "";
    for (let i = 0; i < words.length; i++) {
      let temp = words.slice(0, i + 1).join(" ");
      if (temp.length <= 15) {
        result = temp;
      } else {
        if (i > 0) {
          let shortened = words.slice(0, i).join(" ");
          let lastInitial = words[i][0] + ".";
          let tempAlt = `${shortened} ${lastInitial}`;
          if (tempAlt.length <= 15) return tempAlt;
        }
        break;
      }
    }
    return result || words[0];
  };

  const displayName = getDisplayName(user?.fullname);

  const isValidPhoto = user?.user_photo && user.user_photo.trim() !== "";
  const profilePhoto = isValidPhoto ? user.user_photo : "/assets/admin1.png";

  if (loading) {
    return;
  }

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return null;
  }

  let navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Training", path: "/training-admin" },
    {
      name: "Validation",
      path: "/validation",
      submenu: [
        { name: "Training Registration", path: "/validation/training" },
        { name: "User Certificate", path: "/validation/certificate" },
      ],
    },
    { name: "Certificate", path: "/certificate-admin" },
    { name: "Article", path: "/article-admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white py-3 drop-shadow-[0_2px_4px_rgba(237,113,23,0.3)]">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 w-full max-w-screen-xl mx-auto">
        <div className="flex-shrink w-auto">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-8 w-auto max-w-[120px]"
          />
        </div>

        <div className="hidden md:flex items-center lg:space-x-8 md:space-x-4 font-medium">
          {navLinks.map((link, index) => {
            const isActive =
              pathname === link.path ||
              (link.submenu &&
                link.submenu.some((sub) => pathname === sub.path));

            const isDropdownOpen = activeDropdown === index;

            return (
              <div
                key={index}
                className="relative group"
                onClick={() => setActiveDropdown(isDropdownOpen ? null : index)}
              >
                {link.submenu ? (
                  <button
                    className={`flex items-center focus:outline-none hover:text-mainOrange ${
                      isActive
                        ? "text-mainOrange font-semibold"
                        : "text-mainBlue"
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.path}
                    className={`flex items-center hover:text-mainOrange ${
                      isActive
                        ? "text-mainOrange font-semibold"
                        : "text-mainBlue"
                    }`}
                    onClick={closeAllMenus}
                  >
                    {link.name}
                  </Link>
                )}

                {link.submenu && (
                  <div
                    className={`absolute z-10 bg-white border rounded shadow-lg mt-2 transition-all duration-150 ${
                      isDropdownOpen ? "block" : "hidden"
                    }`}
                  >
                    <ul className="py-2 w-60 text-mainBlue font-normal">
                      <li>
                        <Link
                          href={link.path}
                          onClick={closeAllMenus}
                          className="block px-4 py-2 hover:bg-gray-100 font-semibold"
                        >
                          {link.name} Overview
                        </Link>
                      </li>
                      {link.submenu.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={sub.path}
                            onClick={closeAllMenus}
                            className={`block px-4 py-2 hover:bg-gray-100 ${
                              router.pathname === sub.path
                                ? "font-semibold text-mainOrange"
                                : ""
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          <div className="relative" ref={refs.profile}>
            <button
              onClick={() => toggleMenu("profile")}
              className="flex items-center space-x-2 hover:text-mainOrange"
            >
              <img
                src={profilePhoto}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="max-w-[120px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {displayName}
              </span>
            </button>
            {menuState.profile && (
              <div className="absolute right-0 mt-3 w-52 bg-white border rounded-md shadow-lg">
                <ul className="py-1">
                  {user.role === "superadmin" && (
                    <li>
                      <Link
                        href="/manage-admin"
                        onClick={closeAllMenus}
                        className="block px-4 py-2 hover:bg-gray-100 text-mainBlue"
                      >
                        Manage Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        router.push("/manage-home");
                      }}
                      className="block px-4 py-2 text-mainBlue hover:bg-gray-100 w-full text-left"
                    >
                      Home Management
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        router.push("/edit-profile");
                      }}
                      className="block px-4 py-2 text-mainBlue hover:bg-gray-100 w-full text-left"
                    >
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        router.push("/auth/change-password");
                      }}
                      className="block px-4 py-2 text-mainBlue hover:bg-gray-100 w-full text-left"
                    >
                      Change Password
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        router.push("/home");
                      }}
                      className="block px-4 py-2 text-error1 hover:bg-gray-100 w-full text-left"
                    >
                      Logout{" "}
                      <FaSignOutAlt className="inline ml-1 text-neutral3" />
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
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
                <li>
                  <button
                    onClick={() => toggleMenu("userSubmenu")}
                    className="flex items-center space-x-2 w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <img
                      src={profilePhoto}
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                    <span>{displayName}</span>
                  </button>
                  {menuState.userSubmenu && (
                    <div className="ml-10 mt-2 space-y-1">
                      <Link
                        href="/edit-profile"
                        className="block px-2 py-1 hover:bg-gray-100 rounded"
                        onClick={closeAllMenus}
                      >
                        Edit Profile
                      </Link>
                      <Link
                        href="/auth/change-password"
                        className="block px-2 py-1 hover:bg-gray-100 rounded"
                        onClick={closeAllMenus}
                      >
                        Change Password
                      </Link>
                    </div>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => {
                      router.push("/manage-home");
                    }}
                    className="block px-2 py-1 hover:bg-gray-100 rounded w-full text-left"
                  >
                    Home Management
                  </button>
                </li>

                {user.role === "superadmin" && (
                  <li>
                    <Link
                      href="/manage-admin"
                      onClick={closeAllMenus}
                      className="block px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Manage Admin
                    </Link>
                  </li>
                )}

                {navLinks
                  .filter((link) => link.name !== "Validation")
                  .map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.path}
                        className="block px-2 py-1 hover:bg-gray-100 rounded"
                        onClick={closeAllMenus}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}

                <li className="relative" ref={refs.validation}>
                  <button
                    onClick={() => toggleMenu("validation")}
                    className="flex justify-between w-full items-center px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    <span>Validation</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        menuState.validation ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {menuState.validation && (
                    <ul className="pl-4 mt-1 space-y-1">
                      <li>
                        <Link
                          href="/validation"
                          className="block py-1 px-2 rounded hover:bg-gray-100"
                          onClick={closeAllMenus}
                        >
                          Validation Overview
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/validation/training"
                          className="block py-1 px-2 rounded hover:bg-gray-100"
                          onClick={closeAllMenus}
                        >
                          Training Registration
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/validation/certificate"
                          className="block py-1 px-2 rounded hover:bg-gray-100"
                          onClick={closeAllMenus}
                        >
                          User Certificate
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li className="border-t pt-2">
                  <button
                    onClick={() => {
                      logout();
                      router.push("/home");
                    }}
                    className="block px-2 py-1 text-red-600 hover:bg-gray-100 rounded w-full text-left"
                  >
                    Logout{" "}
                    <FaSignOutAlt className="inline ml-1 text-neutral3" />
                  </button>
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
