import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
<nav className="sticky top-0 z-50 bg-white py-3 drop-shadow-[0_2px_4px_rgba(237,113,23,0.3)]">
<div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="Logo" className="h-8"/>
        </div>

        {/* Navigation Links - Sekarang di kanan */}
        <div className="flex items-center space-x-16">
          <ul className="hidden md:flex space-x-16 text-mainBlue font-medium">
            <li><a href="#" className="hover:text-lightBlue">Home</a></li>
            <li><a href="/user/training" className="hover:text-lightBlue">Training</a></li>
            <li><a href="#" className="hover:text-lightBlue">Certificate</a></li>
            <li><a href="#" className="hover:text-lightBlue">Article</a></li>
          </ul>

          {/* Sign In Button */}
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg flex items-center">
            <FaUser className="mr-2" />
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
