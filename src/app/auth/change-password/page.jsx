"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setNewPasswordError("");
    setConfirmPasswordError("");

    let valid = true;

    if (!newPassword) {
      setNewPasswordError("New password cannot be empty.");
      valid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      valid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Password doesn't match.");
      valid = false;
    }

    if (valid) {
      alert("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row -mt-16">

      <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
        <img
          src="/assets/Gambar2.jpg"
          alt="Change Password Image"
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="w-full md:w-1/2 h-auto flex items-center justify-center p-4">
        <div className="w-[550px] space-y-6 mt-[-80px]">
          <form
            onSubmit={handleSubmit}
            className="border-2 border-[#03649F] rounded-[10px] p-6 space-y-4 bg-white shadow-md"
          >
            {/* Icon and Title Inside Border */}
            <div className="flex flex-col items-center space-y-2 mb-8">
              <img
                src="/assets/Icon.png"
                alt="Icon"
                className="w-16 h-16"
              />
              <h1 className="text-2xl font-bold text-[#333333] text-center">Change Password</h1>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-lg font-semibold text-[#333333] flex items-center">
                New Password <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full border rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] placeholder:text-[14px] shadow-md pr-12 ${
                    newPasswordError ? "border-red-500" : "border-[#03649F]"
                  }`}
                />
                <div
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
              <p className={`text-xs ${newPasswordError ? "text-red-500" : "text-transparent"} min-h-[16px]`}>
                {newPasswordError || "."}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-lg font-semibold text-[#333333] flex items-center">
                Confirm Password <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full border rounded-[10px] px-4 py-2 focus:outline-none placeholder:text-[#D9D9D9] placeholder:text-[14px] shadow-md pr-12 ${
                    confirmPasswordError ? "border-red-500" : "border-[#03649F]"
                  }`}
                />
                <div
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
              <p className={`text-xs ${confirmPasswordError ? "text-red-500" : "text-transparent"} min-h-[16px]`}>
                {confirmPasswordError || "."}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-[#ED7117] hover:bg-orange-600 text-white font-semibold rounded-[10px] w-[180px] h-[36px] transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
