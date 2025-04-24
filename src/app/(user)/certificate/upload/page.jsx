"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload, FaFilePdf, FaCheckCircle, FaAsterisk } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [date, setDate] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf,image/*",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleSubmit = () => {
    if (!fullName || !institution || !date || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }
    setShowDialog(true);
    setFullName("");
    setInstitution("");
    setDate("");
    setFile(null);
  };

  return (
    <div className="max-w-screen mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Certificate</h1>

      <div
        {...getRootProps()}
        className="border-2 border-dashed h-64 md:h-[362px] w-full max-w-[1129px] mx-auto border-mainBlue rounded-lg flex items-center justify-center cursor-pointer px-4 text-center"
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FaFilePdf className="text-red-500 text-5xl" />
            <p className="text-gray-700 break-words text-sm text-center max-w-[90%]">{file.name}</p>
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
            <span className="text-mainBlue text-sm md:text-base">
              Drag and drop your certification here or click to browse
            </span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mt-6 max-w-[926px] mx-auto px-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <label className="font-semibold w-full md:w-1/4">
            Full Name <FaAsterisk className="inline text-red-500 w-2 h-2" />
          </label>
          <input
            type="text"
            placeholder="Type your name here"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full md:w-3/4 p-2 border border-lightBlue rounded-md"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <label className="font-semibold w-full md:w-1/4">
            Institution <FaAsterisk className="inline text-red-500 w-2 h-2" />
          </label>
          <input
            type="text"
            placeholder="Type your institution here"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full md:w-3/4 p-2 border border-lightBlue rounded-md"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <label className="font-semibold w-full md:w-1/4">
            Date <FaAsterisk className="inline text-red-500 w-2 h-2" />
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-3/4 p-2 border border-lightBlue rounded-md"
            required
          />
        </div>
      </div>

      <Button
        variant="lightBlue"
        onClick={handleSubmit}
        className="mt-6 block text-center w-full max-w-[280px] mx-auto"
      >
        Submit
      </Button>

      <SuccessDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  );
}