"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { ValidationTable } from "@/components/ui/ValidationTable";
import { dummyCourseData, dummyCertificateData } from "./Data";

const ValidationPage = () => {
  const router = useRouter();
  const [courseData, setCourseData] = useState(dummyCourseData);
  const [certificateData, setCertificateData] = useState(dummyCertificateData);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const needToBeProcessedCourse = courseData.filter(
    (item) =>
      item.validation === "pending" ||
      item.validation === "waiting for payment"
  );
  const needToBeProcessedCertificate = dummyCertificateData.filter(
    (item) => !item.validation
  ) 
   
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleValidation = (type, id) => {
    if (type === "course") {
      setCourseData((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCertificateData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    setCourseData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, validation: status } : item
      )
    );
  };  

  return (
    <div className="max-w-screen mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-12">
      <h1 className="text-xl md:text-2xl font-bold text-left mt-4">Validation</h1>

      {/* Course Validation */}
      <div className="bg-white outline outline-2 md:outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 mb-6 shadow-[4px_4px_0px_0px_#157ab2] sm:shadow-[8px_8px_0px_0px_#157ab2]">
        <div className="relative">
        <div className="flex flex-wrap items-center justify-between mb-4 w-full">
          <h2 className="text-lg md:text-xl font-semibold">Course Registration Validation</h2>
            <div className="relative ml-auto mt-2 sm:mt-0" ref={filterRef}>
              {!isFilterOpen && (
                <BsFillFilterSquareFill
                  className="w-10 h-10 text-secondOrange cursor-pointer"
                  size={28}
                  onClick={() => setIsFilterOpen(true)}
                />
              )}
              {isFilterOpen && (
                <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                  <p className="text-secondBlue font-bold p-2">Sort by</p>
                  <div className="border-t border-gray-300">
                    <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">Name(A-Z)</p>
                    <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">Registration Date</p>
                    <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">Payment Status</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ValidationTable
            dataType="course"
            statusType="needToProcess"
            data={needToBeProcessedCourse.slice(0, 5)}
            onStatusChange={handleStatusChange}
          />

        <div className="flex justify-end mt-4">
          <a href="/validation/course" className="text-black underline cursor-pointer text-sm sm:text-base">
            See All Validation
          </a>
        </div>
      </div>

      {/* Certificate Validation */}
      <div className="bg-white outline outline-2 md:outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_#157ab2] sm:shadow-[8px_8px_0px_0px_#157ab2]">
        <div className="relative">
        <div className="flex flex-wrap items-center justify-between mb-4 w-full">
          <h2 className="text-lg md:text-xl font-semibold">Certificate Validation</h2>
            <div className="relative ml-auto mt-2 sm:mt-0" ref={filterRef}>
              {!isFilterOpen && (
                <BsFillFilterSquareFill
                  className="text-secondOrange cursor-pointer w-10 h-10"
                  size={28}
                  onClick={() => setIsFilterOpen(true)}
                />
              )}
              {isFilterOpen && (
                <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                  <p className="text-secondBlue font-bold p-2">Sort by</p>
                  <div className="border-t border-gray-300">
                    <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">Name</p>
                    <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">ID</p>
                    <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">Issued Date</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ValidationTable
          dataType="certificate"
          statusType="needToProcess"
          data={certificateData.filter((item) => !item.validation).slice(0, 5)}
          onAccept={(id) => handleValidation("certificate", id)}
          onReject={(id) => handleValidation("certificate", id)}
        />

        <div className="flex justify-end mt-4">
          <a href="/validation/certificate" className="text-black underline cursor-pointer text-sm sm:text-base">
            See All Validation
          </a>
        </div>
      </div>
    </div>
  );
};

export default ValidationPage;