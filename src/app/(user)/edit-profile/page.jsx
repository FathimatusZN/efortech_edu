"use client";

import { useState, useEffect, useRef } from "react";
import { FaSave, FaCalendarAlt, FaEdit } from "react-icons/fa";
import HistoryCardCourse from "@/components/layout/HistoryCourseCard";
import { Button } from "@/components/ui/button";

const userProfile = {
  fullName: "Azzahra Rahmadani",
  email: "azzahra@gmail.com",
  phone: "0812345678",
  institution: "UPN 'Veteran' Jawa Timur",
  gender: "Female",
  birthDate: "2002-05-14",
  profileImage: "/assets/foto2.png",
};

const initialCourses = [
  {
    id: 1,
    title: "React Frontend Development",
    date: "25 Februari 2025",
    time: "08.00 - 12.00 WIB",
    mode: "Online",
    image: "/assets/coba_history.png",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    date: "10 Januari 2024",
    time: "08.00 - 12.00 WIB",
    mode: "Offline",
    image: "/assets/gambar1.jpg",
    status: "Done",
  },
  {
    id: 3,
    title: "Fullstack Web Development",
    date: "15 Maret 2025",
    time: "08.00 - 12.00 WIB",
    mode: "Hybrid",
    image: "/assets/foto2.png",
    status: "Upcoming",
  },
];

export default function EditProfile() {
    const [profile, setProfile] = useState(userProfile);
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [courses] = useState(initialCourses);
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
  
    const handleChange = (e) => {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    };
  
    const filteredCourses =
    activeTab === "All" ? courses : courses.filter((course) => course.status.toUpperCase() === activeTab.toUpperCase());
    
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
              <div ref={menuRef} className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg w-40">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">Change Image</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">See Image</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">Remove Image</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input type="text" name="institution" value={profile.institution} onChange={handleChange} placeholder="Institution" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
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
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded w-full" />
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
            <FaSave/>Save Changes
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8">History Course</h2>
      <div className="flex gap-4 mt-2">
        {["All", "Upcoming", "Done"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : ''}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {filteredCourses.map((course) => (
          <HistoryCardCourse key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}
