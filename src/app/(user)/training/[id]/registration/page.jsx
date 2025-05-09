"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { Check, Trash2 } from "lucide-react";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Training Header, display training banner with slideshow effect
const TrainingHeader = React.memo(({ training }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!training?.images) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % training.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [training]);

  return (
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
  );
});

const RegistrationPage = () => {
  // Get training ID from URL params
  const { id } = useParams();
  const router = useRouter();

  // States for form and user data
  const [training, setTraining] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    institution: "",
    date: "",
  });
  const [participantCount, setParticipantCount] = useState(1);
  const [additionalEmails, setAdditionalEmails] = useState([
    { id: crypto.randomUUID(), email: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailValidation, setEmailValidation] = useState({});
  const [redirecting, setRedirecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch training data
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${id}`
        );
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (res.ok && data.data) {
          const userData = data.data;
          setFormData((prev) => ({
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

  // Ref for debouncing email validation
  const debounceTimers = useRef({});

  // Debounce timers for email validation
  useEffect(() => {
    return () => {
      // Clear all timers when component unmounts
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = {
      date: "Date is required",
    };

    for (const key in requiredFields) {
      if (!formData[key]) {
        newErrors[key] = requiredFields[key];
      }
    }

    if (participantCount > 1) {
      additionalEmails.forEach(({ email }, idx) => {
        if (!email)
          newErrors[`email${idx}`] = `Email peserta ke-${idx + 2} harus diisi`;
      });
    }

    // Manual check for checkbox terms
    const termsAccepted = document.getElementById("terms").checked;
    if (!termsAccepted) {
      return false;
    }

    // Validasi tanggal tidak boleh sebelum hari ini
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset jam agar perbandingan lebih akurat

      if (selectedDate < today) {
        newErrors.date = "Tanggal tidak boleh sebelum hari ini";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistrationSubmit = async () => {
    try {
      setLoading(true);

      const allAdditionalEmails = additionalEmails.map((e) =>
        e.email.trim().toLowerCase()
      );

      // Tambahkan email utama (user.email) juga untuk dicek
      const allEmails = [
        user.email.trim().toLowerCase(),
        ...allAdditionalEmails,
      ];
      const uniqueEmails = new Set(allEmails);

      if (uniqueEmails.size !== allEmails.length) {
        alert("Setiap peserta harus menggunakan email yang berbeda.");
        setLoading(false);
        return;
      }

      const token = await user?.getIdToken?.();

      // Initialize participant array with registrant themselves
      const participantUserIds = [{ user_id: user.uid }];

      // Only if participantCount > 1, fetch additional participants
      if (participantCount > 1) {
        for (const { email } of additionalEmails) {
          if (!email.trim()) continue; // Skip if email is empty

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/search?email=${email}`
          );
          const data = await res.json();

          if (res.ok && data.status === "success" && data.data) {
            participantUserIds.push({ user_id: data.data.user_id });
          } else {
            throw new Error(`Participant with email ${email} not found`);
          }
        }
      }

      const payload = {
        training_id: training.training_id,
        registrant_id: user.uid,
        training_date: formData.date,
        participant_count: participantCount,
        participants: participantUserIds,
        final_price: training.final_price || null,
        training_fees: training.training_fees || null,
        payment_proof: null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setShowDialog(true);
      } else {
        console.error(
          "Registration failed:",
          result.message || "Unknown error"
        );
        alert("Failed to submit registration. Please try again.");
      }
    } catch (error) {
      console.error("Registration submit error:", error.message);
      alert(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await handleRegistrationSubmit();
  };

  const handleParticipantCountChange = useCallback((e) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setParticipantCount(count);

    setAdditionalEmails((prevEmails) => {
      const targetLength = count - 1;
      const updatedEmails = [...prevEmails];

      if (targetLength > updatedEmails.length) {
        // Tambahkan field kosong
        while (updatedEmails.length < targetLength) {
          updatedEmails.push({ id: crypto.randomUUID(), email: "" });
        }
      } else if (targetLength < updatedEmails.length) {
        // Hapus field kelebihan TAPI tetap simpan data yang ada
        return updatedEmails.slice(0, targetLength);
      }

      return updatedEmails;
    });

    // Kita juga perlu sinkronisasi validasi dan error
    setEmailValidation((prev) => {
      const newValidation = { ...prev };
      Object.keys(newValidation).forEach((key) => {
        if (parseInt(key) >= count - 1) {
          delete newValidation[key];
        }
      });
      return newValidation;
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("email")) {
          const idx = parseInt(key.replace("email", ""));
          if (idx >= count - 1) {
            delete newErrors[key];
          }
        }
      });
      return newErrors;
    });
  }, []);

  const validateEmailExists = async (email, id, idx) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Cek duplikat antar additional email
    const duplicate = additionalEmails.some(
      (entry, i) =>
        i !== idx && entry.email.trim().toLowerCase() === trimmedEmail
    );

    if (duplicate || trimmedEmail === user.email.trim().toLowerCase()) {
      setEmailValidation((prev) => ({
        ...prev,
        [id]: false,
      }));
      setErrors((prev) => ({
        ...prev,
        [id]: `Email peserta ke-${idx + 2} sudah digunakan`,
      }));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/search?email=${trimmedEmail}`
      );
      const data = await res.json();

      const userExists = res.ok && data.status === "success" && data.data;

      setEmailValidation((prev) => ({
        ...prev,
        [id]: userExists,
      }));

      if (!userExists) {
        setErrors((prev) => ({
          ...prev,
          [id]: `Email peserta ke-${idx + 2} belum terdaftar`,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    } catch (err) {
      console.error("Email check failed:", err);
      setErrors((prev) => ({
        ...prev,
        [id]: `Gagal memeriksa email peserta ke-${idx + 2}`,
      }));
    }
  };

  const FormGroup = React.memo(
    ({
      label,
      required = false,
      type = "text",
      value,
      onChange,
      error,
      placeholder,
      min,
      readOnly = false,
    }) => (
      <div className="mt-6 flex items-start">
        <label className="w-1/4 text-black font-semibold pt-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="w-3/4 flex flex-col">
          {readOnly ? (
            <div
              className="p-2 pl-4 bg-gray-100 rounded-lg text-sm text-gray-700 min-h-[40px] flex items-center cursor-not-allowed hover:bg-gray-200 transition"
              title="This field can only be edited in your profile"
            >
              {value || "-"}
            </div>
          ) : (
            <input
              type={type}
              min={min}
              className="p-2 pl-4 border rounded-lg border-mainOrange placeholder:text-sm 
                focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    )
  );

  if (loading || redirecting) return <LoadingSpinner text="Loading..." />;

  if (showLoginModal) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">
            You need to sign in
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Please sign in to continue registration.
          </p>
          <button
            onClick={() =>
              router.push(`/auth/signin?redirect=/training/${id}/registration`)
            }
            className="bg-mainOrange text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!training)
    return (
      <div className="text-center mt-10 text-red-600">Training not found.</div>
    );

  return (
    <div>
      <div>
        <TrainingHeader training={training} />
      </div>

      <h2 className="text-2xl text-center text-black font-extrabold p-6">
        Registration Form
      </h2>

      <div className="max-w-3xl mb-20 mx-auto p-6 border-4 border-mainBlue rounded-lg bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          <FormGroup label="Full Name" value={formData.fullName} readOnly />
          <FormGroup label="Email" value={formData.email} readOnly />
          <FormGroup
            label="Institution"
            value={formData.institution}
            readOnly
          />

          <FormGroup
            label="Date"
            required
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            error={errors.date}
            min={new Date().toISOString().split("T")[0]} // Disable past dates
          />

          <FormGroup
            label="Jumlah Peserta"
            required
            type="number"
            min={1}
            value={participantCount}
            onChange={handleParticipantCountChange}
          />

          {/* Additional participant emails*/}
          {participantCount > 1 && (
            <div className="mt-6">
              <label className="block text-black font-semibold mb-2">
                Email Peserta Lain <span className="text-red-500">*</span>
              </label>
              {additionalEmails.map(({ id, email }, idx) => (
                <div key={id} className="mb-2 relative">
                  <div className="relative h-10">
                    <input
                      type="email"
                      required
                      className="w-full p-2 pl-4 pr-10 border rounded-lg border-mainOrange placeholder:text-sm 
                    focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                      placeholder={`Email peserta ke-${idx + 2}`}
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAdditionalEmails((prev) =>
                          prev.map((emailObj) =>
                            emailObj.id === id
                              ? { ...emailObj, email: value }
                              : emailObj
                          )
                        );

                        // Kalau kosong, langsung hapus validasi & error-nya
                        if (!value.trim()) {
                          setEmailValidation((prev) => {
                            const { [id]: _, ...rest } = prev;
                            return rest;
                          });

                          setErrors((prev) => {
                            const { [id]: _, ...rest } = prev;
                            return rest;
                          });
                          return;
                        }
                        // Debounce validasi email
                        clearTimeout(debounceTimers.current[id]);
                        debounceTimers.current[id] = setTimeout(() => {
                          validateEmailExists(value, id, idx);
                        }, 1000);
                      }}
                    />
                    {/* Icon hapus */}
                    <button
                      type="button"
                      onClick={() => {
                        setAdditionalEmails((prev) =>
                          prev.filter((emailObj) => emailObj.id !== id)
                        );
                        setParticipantCount((prev) => Math.max(1, prev - 1));

                        setEmailValidation((prev) => {
                          const { [id]: _, ...rest } = prev;
                          return rest;
                        });

                        setErrors((prev) => {
                          const { [id]: _, ...rest } = prev;
                          return rest;
                        });
                      }}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Icon check jika email valid */}
                    {email.trim() && emailValidation[id] && (
                      <Check
                        className="absolute top-1/2 right-10 transform -translate-y-1/2 text-green-500"
                        size={18}
                      />
                    )}
                  </div>
                  {/* Error */}
                  {errors[id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
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
            <label
              htmlFor="terms"
              className="ml-1 text-gray-800 text-sm leading-snug"
            >
              Saya bertanggung jawab atas data peserta yang saya daftarkan dan menyetujui seluruh syarat dan ketentuan pelatihan.
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

        <SuccessDialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setRedirecting(true);
              setTimeout(() => {
                router.push("/edit-profile");
              }, 500);
            }
          }}
          title="Registration Success!"
          messages={[
            "We’ll email the details to you soon.",
            "Have a great day!",
          ]}
          buttonText="Okay"
        />
      </div>
    </div>
  );
};

export default RegistrationPage;
