"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const trainingData = {
  title: "Accelerating Digital O&M using DeviceOn/BI and Patrol Inspection",
  images: [
    "/assets/gambar1.jpg",
    "/assets/Gambar2.jpg",
    "/assets/dashboard-bg.png",
  ],
};

const RegistrationPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({ fullName: "", institution: "", date: "", payment: null });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % trainingData.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.institution) newErrors.institution = "Institution is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.payment) newErrors.payment = "Payment proof is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div>
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={trainingData.images[currentImageIndex]}
          alt="Training Header"
          layout="fill"
          objectFit="cover"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-white drop-shadow-2xl bg-black/30 p-2 shadow-blue-900 shadow-xl">
          {trainingData.title}
        </h1>
      </div>
      <h2 className="text-2xl font-superbold text-center text-black p-6">Registration Form</h2>
      <div className="max-w-3xl mx-auto p-6 border-4 border-mainBlue rounded-lg bg-white shadow-2xl">   
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <label className="w-1/3 text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input type="text" className="w-2/3 p-2 border rounded" placeholder="Enter your full name" 
              value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-1/3 text-gray-700">Institution <span className="text-red-500">*</span></label>
            <input type="text" className="w-2/3 p-2 border rounded" placeholder="Enter your institution"
              value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
            {errors.institution && <p className="text-red-500 text-sm">{errors.institution}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-1/3 text-gray-700">Date <span className="text-red-500">*</span></label>
            <input type="date" className="w-2/3 p-2 border rounded"
              value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-1/3 text-gray-700">Payment <span className="text-red-500">*</span></label>
            <input type="file" className="w-2/3 p-2 border rounded"
              onChange={(e) => setFormData({...formData, payment: e.target.files[0]})} />
            {errors.payment && <p className="text-red-500 text-sm">{errors.payment}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-gray-700">I agree to the terms and conditions.</label>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-all">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
