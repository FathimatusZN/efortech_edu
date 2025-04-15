"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Upload } from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // validasi form di sini...
    setIsSubmitted(true);
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

      <h2 className="text-2xl text-center text-black font-extrabold p-6">Registration Form</h2>

      <div className="max-w-3xl mb-20 mx-auto p-6 border-4 border-mainBlue rounded-lg bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="mt-4 flex items-start">
            <label className="w-1/4 text-black font-semibold pt-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="w-3/4 flex flex-col">
              <input
                type="text"
                className="p-2  pl-4 border rounded-lg border-mainOrange placeholder:text-sm 
                          focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                placeholder="Type your name here"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1 pl-1">{errors.fullName}</p>}
            </div>
          </div>

          {/* Institution */}
          <div className="mt-6 flex items-start">
            <label className="w-1/4 text-black font-semibold pt-2">
              Institution <span className="text-red-500">*</span>
            </label>
            <div className="w-3/4 flex flex-col">
              <input
                type="text"
                className="p-2 pl-4 border rounded-lg border-mainOrange placeholder:text-sm 
                          focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                placeholder="Type your institution here"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              />
              {errors.institution && <p className="text-red-500 text-sm mt-1 pl-1">{errors.institution}</p>}
            </div>
          </div>

          {/* Date */}
          <div className="mt-6 flex items-start">
            <label className="w-1/4 text-black font-semibold pt-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="w-3/4 flex flex-col">
            <input
              type="date"
              className={`p-2 pl-4 border rounded-lg border-mainOrange text-sm appearance-none
                          focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1
                          ${formData.date ? 'text-black' : 'text-gray-400'}`}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="mt-6 flex items-start">
          <label className="w-1/4 text-black font-semibold pt-2">
            Payment <span className="text-red-500">*</span>
          </label>
          <div className="w-3/4 flex flex-col">
            <label
              htmlFor="payment"
              className={`flex items-center gap-2 border rounded-lg p-2 px-4 cursor-pointer
                border-mainOrange text-sm transition
                ${formData.payment ? 'text-black' : 'text-gray-400'}`}
            >
              <Upload size={18} className={`${formData.payment ? 'text-black' : 'text-gray-400'}`} />
              {formData.payment ? formData.payment.name : 'Upload JPG/PNG'}
            </label>
            <input
              id="payment"
              type="file"
              accept=".jpg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, payment: file });
                setImagePreview(URL.createObjectURL(file)); // set preview img
              }}
            />
            {imagePreview && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={imagePreview}
              alt="Preview"
              onClick={() => setShowModal(true)}
              className="w-32 h-20 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, payment: null });
                setImagePreview(null);
              }}
              className="mt-1 self-start text-xs bg-white border border-red-500 text-red-600 px-2 py-1 rounded-md hover:bg-red-100 transition"
            >
              Remove
            </button>
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="relative bg-white rounded-lg p-4 max-w-full max-h-full">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                  >
                    &times;
                  </button>
                  <img
                    src={imagePreview}
                    alt="Full Preview"
                    className="max-w-[90vw] max-h-[80vh] object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
          </div>
        </div>

          {/* Terms */}
        <div className="mt-12 ml-6 flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1.5 accent-orange-500 w-4 h-4 border border-gray-400 rounded-sm"
          />
          <label htmlFor="terms" className="ml-1 text-gray-800 text-sm leading-snug">
            Saya menyatakan Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
            molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
            sollicitudin lacus, ut interdum tellus elit sed risus.
          </label>
        </div>

          {/* Submit Button */}
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
