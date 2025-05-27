import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { ChevronDown } from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";

const UserNavbar = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [menuState, setMenuState] = useState({
    profile: false,
    mobile: false,
    certificateDesktop: false,
    certificateMobile: false,
    userSubmenu: false,
  });

  const refs = {
    profile: useRef(null),
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
      profile: false,
      mobile: false,
      certificate: false,
      userSubmenu: false,
    });
  };

  // Close menu when clicking outside
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

  // Close dropdown when route changes
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
  const profilePhoto = isValidPhoto ? user.user_photo : "/assets/user1.png";

  if (loading) {
    return;
  }

  if (!user) {
    return null;
  }

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
            const isMenuOpen = menuState.certificateDesktop;
            return (
              <div
                key={index}
                className="relative"
                ref={link.name === "Certificate" ? refs.certificate : null}
              >
                {link.subMenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu("certificateDesktop")}
                      className={`flex items-center gap-1 ${isActiveLink || isMenuOpen
                          ? "text-mainOrange font-semibold"
                          : "hover:text-mainOrange"
                        }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute top-10 left-0 bg-white border rounded-md shadow-lg w-48 z-10">
                        {link.subMenu.map((sub, idx) => {
                          const isSubActive = pathname === sub.path;
                          return (
                            <Link
                              key={idx}
                              href={sub.path}
                              className={`block px-4 py-2 hover:bg-gray-100 ${isSubActive
                                  ? "text-mainOrange font-semibold"
                                  : ""
                                }`}
                              onClick={closeAllMenus}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.path}
                    className={`hover:text-mainOrange ${pathname === link.path
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
                <Link
                  href="/edit-profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Edit Profile
                </Link>
                <Link
                  href="/auth/change-password"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeAllMenus}
                >
                  Change Password
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/home");
                  }}
                  className="block px-4 py-2 text-error1 hover:bg-gray-100 w-full text-left"
                >
                  Logout <FaSignOutAlt className="inline ml-1 text-neutral3" />
                </button>
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

                {navLinks.map((link, index) => (
                  <li key={index}>
                    {link.subMenu ? (
                      <>
                        <button
                          onClick={() => toggleMenu("certificateMobile")}
                          className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                        >
                          {link.name}
                        </button>
                        {menuState.certificateMobile && (
                          <div className="ml-6 mt-1 space-y-1">
                            {link.subMenu.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.path}
                                className={`block px-2 py-1 hover:bg-gray-100 rounded ${pathname === sub.path
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
                        className={`block px-2 py-1 hover:bg-gray-100 rounded ${pathname === link.path
                            ? "text-mainOrange font-semibold"
                            : ""
                          }`}
                        onClick={closeAllMenus}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}

                <li className="border-t pt-2">
                  <button
                    onClick={() => {
                      logout();
                      router.push("/home");
                    }}
                    className="block px-2 py-1 text-red-600 hover:bg-gray-100 rounded w-full text-left"
                  >
                    Logout <FaSignOutAlt className="inline ml-1 text-neutral3" />
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

export default UserNavbar;
