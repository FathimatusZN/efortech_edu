"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { useProfile } from "@/app/context/ProfileContext";

type ProfileForm = {
  fullname: string;
  email: string;
  phone_number: string;
  institution: string;
  gender: string; // Store as "Male", "Female", or "Default" like EditProfile
  birthdate: string;
  role: string;
  position: string;
  user_photo: string;
};

export default function CompleteProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, logout } = useAuth();
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

  /* =========================
      HANDLERS
  ========================= */

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

  /* =========================
      UI
  ========================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-lg shadow"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <FaUser className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold">Complete Your Profile</h1>
          <p className="text-sm text-gray-500">
            Please complete your profile to continue
          </p>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={profile.user_photo}
            className="w-28 h-28 rounded-full object-cover border"
            alt="profile"
          />
          <button
            type="button"
            className="text-sm text-blue-600 mt-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Change photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0])}
          />
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="fullname"
            value={profile.fullname}
            onChange={handleChange}
            placeholder="Full Name"
            className="input"
            required
          />
          <input
            name="institution"
            value={profile.institution}
            onChange={handleChange}
            placeholder="Institution"
            className="input"
          />
          <input
            value={profile.email}
            readOnly
            className="input bg-gray-100"
            placeholder="Email"
          />
          <input
            name="phone_number"
            value={profile.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input"
            required
          />

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="input"
          >
            <option value="Default">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="date"
            name="birthdate"
            value={profile.birthdate}
            onChange={handleChange}
            className="input"
          />

          <select
            name="role"
            value={profile.role}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Role</option>
            <option value="1">Teacher / Lecturer</option>
            <option value="2">Student (School)</option>
            <option value="3">University Student</option>
            <option value="4">Professional</option>
            <option value="5">Others</option>
          </select>

          <input
            name="position"
            value={profile.position}
            onChange={handleChange}
            placeholder="Position"
            className="input"
            required
          />
        </div>

        <button
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}
