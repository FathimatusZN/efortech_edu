"use client";

import { useState, useEffect, useRef } from "react";
import { FaSave, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import HistoryCourse from "./HistoryCourse";

const userProfile = {
  fullName: "Azzahra Rahmadani",
  email: "azzahra@gmail.com",
  phone: "0812345678",
  institution: "UPN 'Veteran' Jawa Timur",
  gender: "Female",
  birthDate: "2002-05-14",
  profileImage: "/assets/foto2.png",
};

export default function EditProfile() {
  const [profile, setProfile] = useState(userProfile);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="outline outline-3 outline-mainBlue p-6 rounded-lg">
        <div className="flex gap-6 items-center relative">
          <div
            className="relative w-60 h-60"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-60 h-60 rounded-full object-cover border"
            />
            {isHovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                onClick={toggleMenu}
              >
                <FaEdit className="text-white text-4xl" />
              </div>
            )}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg w-40"
              >
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">Change Image</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">See Image</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">Remove Image</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input type="text" name="institution" value={profile.institution} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className="border p-2 rounded w-full">
                <option>Default</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Birthdate</label>
              <input type="date" name="birthDate" value={profile.birthDate} onChange={handleChange} className="border p-2 rounded w-full" />
              <FaCalendarAlt className="absolute right-2 top-10 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="orange">
            <FaSave /> Save Changes
          </Button>
        </div>
      </div>

      {/* History Course Dipisah */}
      <HistoryCourse />
    </div>
  );
}
