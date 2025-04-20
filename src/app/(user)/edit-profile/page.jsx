"use client";

import { useState, useEffect, useRef } from "react";
import { FaSave, FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import HistoryCourse from "./HistoryCourse";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";

export default function EditProfile() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Update profile input field
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fetch user profile data from backend
  useEffect(() => {
    let didFetch = false;

    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser || didFetch) return;
        const token = await getIdToken(currentUser);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        const u = data.data;
        setProfile({
          fullName: u.fullname || "",
          email: u.email || "",
          phone: u.phone_number || "",
          institution: u.institution || "",
          gender: u.gender === 1 ? "Male" : u.gender === 2 ? "Female" : "Default",
          birthDate: u.birthdate ? u.birthdate.split("T")[0] : "",
          profileImage: u.user_photo || "/default-profile.png",
        });

        didFetch = true;
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      }
    };

    if (!loading && user) fetchProfile();

    // Close dropdown if clicked outside
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loading, user]);

  if (!profile) return <div className="p-8">Loading profile...</div>;

  // Save updated profile data to backend
  const handleSave = async () => {
    if (!user) return toast.error("You haven't login");

    try {
      const token = await getIdToken(user);
      let uploadedImageUrl = profile.profileImage;

      // Upload new image if selected
      if (newImageFile) {
        const formData = new FormData();
        formData.append("images", newImageFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/upload-user-photo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Failed to upload image");

        uploadedImageUrl = uploadData.data.imageUrl;
      }

      // Update user profile
      const editRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/edit-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: profile.fullName,
          institution: profile.institution,
          phone_number: profile.phone,
          gender: profile.gender,
          birthdate: profile.birthDate,
          user_photo: uploadedImageUrl,
        }),
      });

      const editData = await editRes.json();
      if (!editRes.ok) throw new Error(editData.message || "Failed to update profile");

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <div className="outline outline-3 outline-mainBlue p-6 rounded-lg">
        <div className="flex gap-6 items-center relative">
          {/* Profile Image Section */}
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
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Change Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewImageFile(file);
                      setProfile((prev) => ({ ...prev, profileImage: URL.createObjectURL(file) }));
                    }
                  }}
                />
                <button
                  onClick={() => setShowImageModal(true)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  See Image
                </button>
                <button
                  onClick={() => {
                    setNewImageFile(null);
                    setProfile((prev) => ({ ...prev, profileImage: "/assets/user1.png" }));
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Full Size Modal Image */}
          {showImageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full aspect-square flex flex-col items-center">
                <img src={profile.profileImage} alt="Full" className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => setShowImageModal(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* User Info Inputs */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Institution", name: "institution", type: "text" },
              { label: "Email", name: "email", type: "email", readOnly: true, className: "bg-gray-100 cursor-not-allowed" },
              { label: "Gender", name: "gender", type: "select", options: ["Default", "Male", "Female"] },
              { label: "Phone Number", name: "phone", type: "text" },
              { label: "Birthdate", name: "birthDate", type: "date" },
            ].map((input, idx) => (
              <div key={idx} className={input.className || ""}>
                <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                {input.type === "select" ? (
                  <select
                    name={input.name}
                    value={profile[input.name]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  >
                    {input.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.type}
                    name={input.name}
                    value={profile[input.name]}
                    onChange={handleChange}
                    readOnly={input.readOnly || false}
                    className={`border p-2 rounded w-full ${input.className || ""}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="orange" onClick={handleSave}>
            <FaSave /> Save Changes
          </Button>
        </div>
      </div>

      {/* History Course Section */}
      <HistoryCourse />
    </div>
  );
}