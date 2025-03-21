import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCertificateMenuOpen, setIsCertificateMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const certificateMenuRef = useRef(null);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleCertificateMenu = () => setIsCertificateMenuOpen(!isCertificateMenuOpen);

  let navLinks = [
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (certificateMenuRef.current && !certificateMenuRef.current.contains(event.target)) {
        setIsCertificateMenuOpen(false);
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
        <div className="hidden md:flex items-center space-x-8 text-mainBlue font-medium">
          {navLinks.map((link, index) => (
            <div key={index} className="relative" ref={link.name === "Certificate" ? certificateMenuRef : null}>
              {link.subMenu ? (
                <>
                  <button
                    onClick={toggleCertificateMenu}
                    className="hover:text-mainOrange flex items-center"
                  >
                    {link.name}
                  </button>
                  {isCertificateMenuOpen && (
                    <div className="absolute top-10 left-0 bg-white border rounded-md shadow-lg w-48">
                      {link.subMenu.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.path}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={link.path} className="hover:text-mainOrange">{link.name}</Link>
              )}
            </div>
          ))}

          {/* Profile Button */}
          <div className="relative" ref={profileMenuRef}>
            <button onClick={toggleProfileMenu} className="flex items-center space-x-2 hover:text-mainOrange">
              <img src="/assets/user1.png" className="w-8 h-8 rounded-full border border-gray-300" />
              <span>{user?.name || "User"}</span>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white border rounded-md shadow-lg">
                <Link href="/user/edit-profile" className="block px-4 py-2 hover:bg-gray-100">
                  Edit Profile
                </Link>
                <Link href="/auth/change-password" className="block px-4 py-2 hover:bg-gray-100">
                  Change Password
                </Link>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="block px-4 py-2 text-mainBlue hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden relative" ref={mobileMenuRef}>
          <button onClick={toggleMobileMenu} className="flex items-center space-x-2">
            <img src="/assets/user1.png" className="w-8 h-8 rounded-full border border-gray-300" />
            <span className="text-sm font-medium text-mainBlue">User</span>
          </button>
          {isMobileMenuOpen && (
            <div className="absolute top-12 right-0 w-56 bg-white border rounded-md shadow-lg p-4">
              <ul className="space-y-2 text-mainBlue font-medium">
                <li>
                  <Link href="/user/edit-profile" className="block px-4 py-2 hover:bg-gray-100">
                    Edit Profile
                  </Link>
                </li>
                {navLinks.map((link, index) => (
                  <li key={index}>
                    {link.subMenu ? (
                      <>
                        <button onClick={toggleCertificateMenu} className="block px-4 py-2 w-full text-left">
                          {link.name}
                        </button>
                        {isCertificateMenuOpen && (
                          <div className="pl-4">
                            {link.subMenu.map((sub, idx) => (
                              <Link key={idx} href={sub.path} className="block px-4 py-2 hover:bg-gray-100">
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={link.path} className="block px-4 py-2 hover:bg-gray-100">{link.name}</Link>
                    )}
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      logout();
                      window.location.reload();
                    }}
                    className="block px-4 py-2 text-mainBlue hover:bg-gray-100 w-full text-left"
                  >
                    Logout
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
