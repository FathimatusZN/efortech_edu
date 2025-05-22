"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { Check, Trash2 } from "lucide-react";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { onAuthStateChanged } from "firebase/auth";
import { FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

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
      <h1 className="absolute inset-0 flex items-center justify-center sm:text-3xl text-lg font-extrabold text-white drop-shadow-2xl bg-black/30 p-2 shadow-blue-900 shadow-xl">
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
  const [participantInput, setParticipantInput] = useState("1");
  const [additionalEmails, setAdditionalEmails] = useState([
    { id: uuidv4(), email: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailValidation, setEmailValidation] = useState({});
  const [redirecting, setRedirecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch training and user data
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
      }
    };

    fetchTraining();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setShowLoginModal(true);
        return;
      }

      const token = await currentUser.getIdToken();
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
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
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

  const handleParticipantCountChange = useCallback(
    (e) => {
      const rawValue = e.target.value;
      setParticipantInput(rawValue);

      // Jangan proses kalau kosong (biar user bisa hapus angka dulu)
      if (rawValue.trim() === "") return;

      const parsed = parseInt(rawValue, 10);
      if (isNaN(parsed)) return;

      const count = Math.max(1, parsed);
      if (count === participantCount) return;
      setParticipantCount(count);

      // Sinkronkan email fields
      setAdditionalEmails((prevEmails) => {
        const targetLength = count - 1;
        const updatedEmails = [...prevEmails];

        if (targetLength > updatedEmails.length) {
          while (updatedEmails.length < targetLength) {
            updatedEmails.push({ id: uuidv4(), email: "" });
          }
        } else if (targetLength < updatedEmails.length) {
          return updatedEmails.slice(0, targetLength);
        }

        return updatedEmails;
      });

      // Sinkronkan validasi
      setEmailValidation((prev) => {
        const newValidation = { ...prev };
        Object.keys(newValidation).forEach((key) => {
          if (parseInt(key) >= count - 1) {
            delete newValidation[key];
          }
        });
        return newValidation;
      });

      // Sinkronkan error
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
    },
    [participantCount]
  );

  const incrementParticipant = useCallback(() => {
    const next = participantCount + 1;
    const nextStr = next.toString();
    setParticipantInput(nextStr);
    handleParticipantCountChange({ target: { value: nextStr } });
  }, [participantCount, handleParticipantCountChange]);

  const decrementParticipant = useCallback(() => {
    const next = Math.max(1, participantCount - 1);
    const nextStr = next.toString();
    setParticipantInput(nextStr);
    handleParticipantCountChange({ target: { value: nextStr } });
  }, [participantCount, handleParticipantCountChange]);

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
      className = "",
      children,
    }) => {
      const [showInfo, setShowInfo] = useState(false);

      const handleReadOnlyClick = () => {
        setShowInfo(true);
        setTimeout(() => setShowInfo(false), 2000);
      };

      return (
        <div className="mt-6 flex flex-col sm:flex-row items-start">
          <label className="sm:w-1/4 text-black font-semibold pt-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="sm:w-3/4 w-full flex flex-col">
            {readOnly ? (
              <div
                className="p-2 pl-4 bg-gray-100 rounded-lg text-sm text-gray-700 min-h-[40px] flex items-center cursor-not-allowed hover:bg-gray-200 transition"
                onClick={handleReadOnlyClick}
              >
                {value || "-"}
              </div>
            ) : (
              <div className="relative w-full">
                <input
                  type={type}
                  min={min}
                  className={`w-full p-2 pl-4 ${children ? "pr-10" : "pr-4"
                    } border rounded-lg border-mainOrange placeholder:text-sm 
              focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1 ${className}`}
                  placeholder={placeholder}
                  value={value}
                  onChange={onChange}
                />
                {children && (
                  <div className="absolute inset-y-0 right-2 flex flex-col justify-center items-center">
                    {children}
                  </div>
                )}
              </div>
            )}

            {/* ✅ Info muncul saat field readOnly diklik */}
            {showInfo && readOnly && (
              <p className="text-xs text-orange-600 mt-1">
                This field can only be edited in your profile.
              </p>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      );
    }
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

      <div className="flex justify-centermx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mb-20 mx-auto px-4 sm:px-6 pb-8 border-4 border-mainBlue rounded-lg bg-white shadow-2xl">
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
              label="Participant Count"
              required
              type="text"
              value={participantInput}
              onChange={handleParticipantCountChange}
              className="text-left text-bold"
            >
              <>
                <button
                  type="button"
                  onClick={incrementParticipant}
                  className="pr-3 hover:text-mainOrange"
                >
                  <FaSortUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={decrementParticipant}
                  className="pr-3 hover:text-mainOrange"
                >
                  <FaSortDown size={14} />
                </button>
              </>
            </FormGroup>

            <p className="text-xs text-gray-600 italic sm:ml-[25%] mb-1">
              You can change this field if you are registering collectively with multiple participants.
            </p>

            {/* Additional participant emails*/}
            {participantCount > 1 && (
              <div className="mt-6">
                <label className="block text-black font-semibold mb-2">
                  Additional Participant Email{" "}
                  <span className="text-red-500">*</span>
                </label>
                {additionalEmails.map(({ id, email }, idx) => (
                  <div key={id} className="mb-2 relative">
                    <div className="relative h-10">
                      <input
                        type="email"
                        required
                        className="w-full p-2 pl-4 pr-10 border rounded-lg border-mainOrange placeholder:text-sm 
                    focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                        placeholder={`Participant Email ${idx + 2}`}
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

                          setParticipantCount((prevCount) => {
                            const updated = Math.max(1, prevCount - 1);
                            setParticipantInput(updated); // ✅ sync input field
                            return updated;
                          });

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
            <div className="mt-8 ml-0 sm:ml-6 flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className=" accent-orange-500 w-4 h-4 border border-gray-400 rounded-sm"
                required
              />
              <label
                htmlFor="terms"
                className=" text-gray-800 text-sm leading-snug break-words"
              >
                I am responsible for the participant data that I have registered
                and agree to all the terms and conditions of the training.
              </label>
            </div>

            <div className="flex justify-center mt-6">
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
    </div>
  );
};

export default RegistrationPage;
