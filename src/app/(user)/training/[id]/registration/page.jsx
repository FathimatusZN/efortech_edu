"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { trainingList } from "../../Data";

const RegistrationPage = () => {
  const { id } = useParams();
  const training = trainingList.find((training) => training.id === id);
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
  
  useEffect(() => {
    if (!training || !training.images) return;
  
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % training.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [training]);  

  // Update jumlah kolom email peserta lain
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
    // validasi form di sini...
    setIsSubmitted(true);
  };

  const handleAdditionalEmailChange = (index, value) => {
    const updatedEmails = [...formData.additionalEmails];
    updatedEmails[index] = value;
    setFormData({ ...formData, additionalEmails: updatedEmails });
  };

  if (!training) {
    return <div className="text-center mt-10 text-red-600">Training not found.</div>;
  }

  const FormGroup = ({
    label,
    required = false,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    min
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

  return (
    <div>
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={training.images[currentImageIndex]}
          alt="Training Header"
          layout="fill"
          objectFit="cover"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-white drop-shadow-2xl bg-black/30 p-2 shadow-blue-900 shadow-xl">
          {training.title}
        </h1>
      </div>

      <h2 className="text-2xl text-center text-black font-extrabold p-6">Registration Form</h2>

      <div className="max-w-3xl mb-20 mx-auto p-6 border-4 border-mainBlue rounded-lg bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>

        {/* Full Name */}
        <FormGroup
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(val) => setFormData({ ...formData, fullName: val })}
            error={errors.fullName}
            placeholder="Type your name here"
          />

          {/* Email */}
          <FormGroup
            label="Email"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="Type your email here"
          />

          {/* Institution */}
          <FormGroup
            label="Institution"
            required
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            error={errors.institution}
            placeholder="Type your institution here"
          />

          {/* Date */}
          <FormGroup
            label="Date"
            required
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
          />

          {/* Participant Count */}
          <FormGroup
            label="Jumlah Peserta"
            required
            type="number"
            min={1}
            value={participantCount}
            onChange={(e) => setParticipantCount(parseInt(e.target.value) || 1)}
          />

          {/* Additional Emails */}
          {participantCount > 1 && (
            <div className="mt-6">
              <label className="block text-black font-semibold mb-2">
                Email Peserta Lain <span className="text-red-500">*</span>
              </label>
              {additionalEmails.map((email, idx) => (
                <div key={idx} className="mb-2">
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

          {/* Submit */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              className="bg-orange-500 text-white px-16 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Modal */}
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
