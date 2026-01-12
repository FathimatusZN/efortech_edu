"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { FaInfoCircle } from "react-icons/fa";

type ProfileForm = {
  fullname: string;
  email: string;
  phone_number: string;
  institution: string;
  gender: string;
  birthdate: string;
  role: string;
  position: string;
  user_photo: string;
};

const FormField = ({
  label,
  children,
  helper,
  tooltip,
}: {
  label: string;
  children: React.ReactNode;
  helper?: string;
  tooltip?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
      {label}
      {tooltip && (
        <span className="text-gray-400 cursor-help" title={tooltip}>
          <FaInfoCircle size={12} />
        </span>
      )}
    </label>
    {children}
    {helper && <span className="text-xs text-gray-500">{helper}</span>}
  </div>
);

export default function CompleteProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { refetch } = useProfile();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [profile, setProfile] = useState<ProfileForm>({
    fullname: "",
    email: "",
    phone_number: "",
    institution: "",
    gender: "Default", // ✅ Same as EditProfile
    birthdate: "",
    role: "",
    position: "",
    user_photo: "/assets/user1.png",
  });

  /* =========================
      FETCH PROFILE
  ========================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const u = data.data;

        setProfile({
          fullname: u.fullname || "",
          email: u.email || "",
          phone_number: u.phone_number || "",
          institution: u.institution || "",
          // ✅ Same mapping as EditProfile
          gender:
            u.gender === 1 ? "Male" : u.gender === 2 ? "Female" : "Default",
          // ✅ Same format as EditProfile
          birthdate: u.birthdate
            ? new Date(u.birthdate).toLocaleDateString("en-CA")
            : "",
          role: u.role ? String(u.role) : "",
          position: u.position || "",
          user_photo: u.user_photo || "/assets/user1.png",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (file?: File) => {
    if (!file) return;

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const renamed = new File(
        [compressed],
        file.name || `user-photo-${Date.now()}.jpg`,
        { type: compressed.type }
      );

      setImageFile(renamed);
      setProfile((p) => ({
        ...p,
        user_photo: URL.createObjectURL(renamed),
      }));
    } catch {
      toast.error("Failed to process image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      let photoUrl = profile.user_photo;

      // Upload image (optional)
      if (imageFile) {
        const fd = new FormData();
        fd.append("images", imageFile);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/upload-user-photo`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message);

        photoUrl = uploadData.data.imageUrl;
      }

      // ✅ EXACT SAME PAYLOAD STRUCTURE AS EDITPROFILE
      const payload = {
        fullname: profile.fullname,
        institution: profile.institution,
        phone_number: profile.phone_number,
        gender: profile.gender, // ✅ Send as string like EditProfile
        birthdate: profile.birthdate,
        user_photo: photoUrl,
        role: parseInt(profile.role) || 0, // ✅ Same as EditProfile
        position: profile.position,
      };

      // Update profile
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/edit-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Update failed");
      }

      toast.success("Profile completed successfully!");
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to complete profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-sm border"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaUser className="text-blue-600 text-lg" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Please Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            This information helps us personalize your experience
          </p>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border bg-gray-100">
            <Image
              src={profile.user_photo}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>

          <button
            type="button"
            className="text-sm text-blue-600 mt-2 hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            Change photo
          </button>

          <span className="text-xs text-gray-400 mt-1">JPG / PNG, max 1MB</span>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0])}
          />
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name">
            <input
              name="fullname"
              value={profile.fullname}
              onChange={handleChange}
              placeholder="Your full name"
              className="input"
              required
            />
          </FormField>

          <FormField label="Email Address">
            <input
              value={profile.email}
              readOnly
              className="input bg-gray-100 cursor-not-allowed"
            />
          </FormField>

          <FormField label="Institution">
            <input
              name="institution"
              value={profile.institution}
              onChange={handleChange}
              placeholder="School / University / Company"
              className="input"
            />
          </FormField>

          <FormField label="Phone Number">
            <input
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              placeholder="+62xxxxxxxxxx"
              className="input"
              required
            />
          </FormField>

          <FormField label="Gender">
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="Default">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </FormField>

          <FormField label="Birthdate">
            <input
              type="date"
              name="birthdate"
              value={profile.birthdate}
              onChange={handleChange}
              className="input"
            />
          </FormField>

          <FormField label="Role">
            <select
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select role</option>
              <option value="1">Teacher / Lecturer</option>
              <option value="2">Student (School)</option>
              <option value="3">University Student</option>
              <option value="4">Professional</option>
              <option value="5">Others</option>
            </select>
          </FormField>

          <FormField
            label="Position"
            tooltip={`Example:
Marketing Manager
Software Engineer
Head of Electrical Engineering Study Program
Dean of Faculty of Engineering
Industrial Engineering Student`}
          >
            <input
              name="position"
              value={profile.position}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="input"
              required
            />
          </FormField>
        </div>

        <button
          disabled={submitting}
          className="mt-8 w-full max-w-[400px] bg-mainBlue hover:bg-lightBlue text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center flex mx-auto"
        >
          {submitting ? "Saving profile..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}
