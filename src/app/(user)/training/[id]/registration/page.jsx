"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";

const RegistrationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [training, setTraining] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    institution: "",
    date: "",
  });
  const [participantCount, setParticipantCount] = useState(1);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch training data
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${id}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setTraining(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch training:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setShowLoginModal(true);
        return;
      }

      const token = await getIdToken(currentUser);
      setUser(currentUser);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.data) {
          const userData = data.data;
          setFormData(prev => ({
            ...prev,
            fullName: userData.fullname || "",
            email: userData.email || currentUser.email || "",
            institution: userData.institution || "",
          }));
        } else {
          console.error("User data not found in backend");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchTraining();
    fetchUser();
  }, [id]);

  // Image slider
  useEffect(() => {
    if (!training?.images) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % training.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [training]);

  // Dynamic participant email inputs
  useEffect(() => {
    const count = Math.max(0, participantCount - 1);
    setAdditionalEmails(Array(count).fill(""));
  }, [participantCount]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.institution) newErrors.institution = "Institution is required";
    if (!formData.date) newErrors.date = "Date is required";
    additionalEmails.forEach((email, idx) => {
      if (!email) newErrors[`email${idx}`] = `Email peserta ke-${idx + 2} harus diisi`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TODO: Submit form to backend
    setIsSubmitted(true);
  };

  const handleParticipantCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setParticipantCount(count);

    const needed = count - 1;
    const newEmails = [...additionalEmails];

    if (needed > newEmails.length) {
      while (newEmails.length < needed) {
        newEmails.push("");
      }
    } else if (needed < newEmails.length) {
      newEmails.splice(needed);
    }

    setAdditionalEmails(newEmails);
  };

  const FormGroup = ({
    label,
    required = false,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    min,
  }) => (
    <div className="mt-6 flex items-start">
      <label className="w-1/4 text-black font-semibold pt-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="w-3/4 flex flex-col">
        <input
          type={type}
          min={min}
          className="p-2 pl-4 border rounded-lg border-mainOrange placeholder:text-sm 
          focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );

  if (loading) return <div className="text-center mt-10 text-blue-600">Loading...</div>;

  if (showLoginModal) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">You need to sign in</h2>
          <p className="text-sm text-gray-600 mb-4">Please sign in to continue registration.</p>
          <button
            onClick={() => router.push(`/auth/signin?redirect=/training/${id}/registration`)}
            className="bg-mainOrange text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!training) return <div className="text-center mt-10 text-red-600">Training not found.</div>;

  return (
    <div>
      {/* Header image & title */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={training.images[currentImageIndex]}
          alt="Training Header"
          layout="fill"
          objectFit="cover"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-white drop-shadow-2xl bg-black/30 p-2 shadow-blue-900 shadow-xl">
          {training.training_name}
        </h1>
      </div>

      <h2 className="text-2xl text-center text-black font-extrabold p-6">Registration Form</h2>

      <div className="max-w-3xl mb-20 mx-auto p-6 border-4 border-mainBlue rounded-lg bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
            placeholder="Type your name here"
          />

          <FormGroup
            label="Email"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="Type your email here"
          />

          <FormGroup
            label="Institution"
            required
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            error={errors.institution}
            placeholder="Type your institution here"
          />

          <FormGroup
            label="Date"
            required
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
          />

          <FormGroup
            label="Jumlah Peserta"
            required
            type="number"
            min={1}
            value={participantCount}
            onChange={handleParticipantCountChange}
          />

          {/* Additional participant emails (unchanged) */}
          {participantCount > 1 && (
            <div className="mt-6">
              <label className="block text-black font-semibold mb-2">
                Email Peserta Lain <span className="text-red-500">*</span>
              </label>
              {additionalEmails.map((email, idx) => (
                <div key={idx} className="mb-2 flex gap-2 items-start">
                  <input
                    type="email"
                    required
                    className="w-full p-2 pl-4 border rounded-lg border-mainOrange placeholder:text-sm 
                      focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                    placeholder={`Email peserta ke-${idx + 2}`}
                    value={additionalEmails[idx]}
                    onChange={(e) => {
                      const newEmails = [...additionalEmails];
                      newEmails[idx] = e.target.value;
                      setAdditionalEmails(newEmails);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newEmails = [...additionalEmails];
                      newEmails.splice(idx, 1);
                      setAdditionalEmails(newEmails);
                      setParticipantCount((prev) => Math.max(1, prev - 1));
                    }}
                    className="text-red-600 font-bold px-2 py-1 hover:underline"
                  >
                    Hapus
                  </button>
                  {errors[`email${idx}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`email${idx}`]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Terms */}
          <div className="mt-12 ml-6 flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1.5 accent-orange-500 w-4 h-4 border border-gray-400 rounded-sm"
              required
            />
            <label htmlFor="terms" className="ml-1 text-gray-800 text-sm leading-snug">
              Saya menyatakan Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </label>
          </div>

          <div className="flex justify-center mt-12">
            <button
              type="submit"
              className="bg-orange-500 text-white px-16 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Success modal */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm text-center">
              <div className="mt-2 text-green-500 text-6xl mb-4">✔</div>
              <h2 className="text-xl font-bold mb-2">Registration Success!</h2>
              <p className="text-sm text-gray-600 mb-4">
                We’ll email the details to you soon. <br /> Have a great day!
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-orange-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;