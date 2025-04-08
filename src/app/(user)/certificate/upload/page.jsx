"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload, FaFilePdf, FaCheckCircle, FaAsterisk } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [date, setDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf,image/*",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleSubmit = () => {
    if (!fullName || !institution || !date || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }
    setShowPopup(true);
    setFullName("");
    setInstitution("");
    setDate("");
    setFile(null);
  };

  return (
    <div className="max-w-screen mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Certificate</h1>

      <div
        {...getRootProps()}
        className="border-2 border-dashed h-[362px] max-w-[1129px] mx-auto border-mainBlue rounded-lg flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FaFilePdf className="text-red-500 text-5xl" />
            <p className="text-gray-700">{file.name}</p>
            <button
              onClick={() => setFile(null)}
              className="mt-2 px-4 py-2 text-error1 border border-error1 bg-white rounded-md hover:bg-error1 hover:text-white transition"
            >
              Hapus
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaUpload className="text-mainBlue text-4xl mb-2" />
            <span className="text-mainBlue">
              Drag and drop your certification here or click to browse
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 text-left max-w-[926px] mx-auto flex items-center gap-4">
        <label className="font-semibold w-1/4">
          Full Name <FaAsterisk className="inline text-red-500 w-2 h-2" />
        </label>
        <input
          type="text"
          placeholder="Type your name here"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-3/4 p-2 border border-lightBlue rounded-md"
          required
        />
      </div>

      <div className="mt-4 text-left max-w-[926px] mx-auto flex items-center gap-4">
        <label className="font-semibold w-1/4">
          Institution <FaAsterisk className="inline text-red-500 w-2 h-2" />
        </label>
        <input
          type="text"
          placeholder="Type your institution here"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="w-3/4 p-2 border border-lightBlue rounded-md"
          required
        />
      </div>

      <div className="mt-4 text-left max-w-[926px] mx-auto flex items-center gap-4">
        <label className="font-semibold w-1/4">
          Date <FaAsterisk className="inline text-red-500 w-2 h-2" />
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-3/4 p-2 border border-lightBlue rounded-md"
          required
        />
      </div>

      <Button variant="lightBlue" onClick={handleSubmit} className="mt-6 block text-center w-full max-w-[280px] mx-auto">
        Submit
      </Button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white border-4 border-mainBlue p-6 rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-8xl mt-8 mx-auto mb-4" />
            <p className="text-lg font-bold text-black mb-2">Submission Success!</p>
            <p className="text-sm font-normal text-mainGrey">We'll email the result to you soon.</p>
            <p className="text-sm font-normal text-mainGrey mb-4">Have a great day!</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 mb-8 bg-mainOrange text-white rounded-md hover:bg-secondOrange"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}