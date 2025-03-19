"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "@/app/firebase/config";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function ChangePasswordPage() {
  const user = auth.currentUser;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("No user is logged in.");
      return;
    }

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row -mt-16">
      <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
        <img src="/assets/Gambar2.jpg" alt="Change Password Image" className="w-full h-full object-cover object-top" />
      </div>

      <div className="w-full md:w-1/2 h-auto flex items-center justify-center p-4">
        <div className="w-[550px] space-y-6 mt-[-80px]">
          <form onSubmit={handleSubmit} className="border-2 border-[#03649F] rounded-[10px] p-6 space-y-4 bg-white shadow-md">
            <div className="flex flex-col items-center space-y-2 mb-8">
              <img src="/assets/Icon.png" alt="Icon" className="w-16 h-16" />
              <h1 className="text-2xl font-bold text-[#333333] text-center">Change Password</h1>
            </div>

            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-lg font-semibold text-[#333333]">Current Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] shadow-md pr-12"
                />
                <div onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-lg font-semibold text-[#333333]">New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] shadow-md pr-12"
                />
                <div onClick={() => setShowNewPassword((prev) => !prev)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                  {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-lg font-semibold text-[#333333]">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#03649F] rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] shadow-md pr-12"
                />
                <div onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button type="submit" className="bg-[#ED7117] hover:bg-orange-600 text-white font-semibold rounded-[10px] w-[180px] h-[36px] transition">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
