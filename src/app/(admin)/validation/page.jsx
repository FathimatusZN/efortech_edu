"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useRef, useState } from "react";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { ValidationTrainingTable } from "@/components/admin/ValidationTrainingTable";
import { ValidationCertificateTable } from "@/components/admin/ValidationCertificateTable";
import { toast } from "react-hot-toast";

const ValidationPage = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Fetch training data for needprocess (same as /validation/training)
  const fetchTrainingData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/search?status=1,2,3`
      );
      if (!res.ok) throw new Error("Failed to fetch training data");

      const result = await res.json();
      setTrainingData(result.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load training data");
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy: fetch certificate data (tetap seperti sebelumnya)
  const fetchCertificateData = async () => {
    // Gantilah dengan API jika sudah tersedia
    setCertificateData([]); // Kosongkan default-nya
  };

  useEffect(() => {
    fetchTrainingData();
    fetchCertificateData();
  }, []);

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsFilterOpen(false);
    }
  };

  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/update/${registrationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated successfully");
      fetchTrainingData(); // Refresh
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const handleValidation = (type, id) => {
    if (type === "certificate") {
      setCertificateData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="max-w-screen mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-12">
        <h1 className="text-xl md:text-2xl font-bold text-left mt-4">
          Validation
        </h1>

        {/* Training Validation */}
        <div className="bg-white outline outline-2 md:outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 mb-6 shadow-[4px_4px_0px_0px_#157ab2] sm:shadow-[8px_8px_0px_0px_#157ab2]">
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between mb-4 w-full">
              <h2 className="text-lg md:text-xl font-semibold">
                Training Registration Validation
              </h2>
              <div className="relative ml-auto mt-2 sm:mt-0" ref={filterRef}>
                {!isFilterOpen && (
                  <BsFillFilterSquareFill
                    className="w-10 h-10 text-secondOrange cursor-pointer"
                    onClick={() => setIsFilterOpen(true)}
                  />
                )}
                {isFilterOpen && (
                  <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                    <p className="text-secondBlue font-bold p-2">Sort by</p>
                    <div className="border-t border-gray-300">
                      <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">
                        Name (A-Z)
                      </p>
                      <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">
                        Registration Date
                      </p>
                      <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">
                        Payment Status
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ValidationTrainingTable
              data={trainingData.slice(0, 5)}
              mode="needprocess"
              onStatusChange={handleStatusChange}
              disablePagination={true}
            />
          )}

          <div className="flex justify-end mt-4">
            <a
              href="/validation/training"
              className="text-black underline cursor-pointer text-sm sm:text-base"
            >
              See All Validation
            </a>
          </div>
        </div>

        {/* Certificate Validation */}
        <div className="bg-white outline outline-2 md:outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_#157ab2] sm:shadow-[8px_8px_0px_0px_#157ab2]">
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between mb-4 w-full">
              <h2 className="text-lg md:text-xl font-semibold">
                Certificate Validation
              </h2>
              <div className="relative ml-auto mt-2 sm:mt-0" ref={filterRef}>
                {!isFilterOpen && (
                  <BsFillFilterSquareFill
                    className="text-secondOrange cursor-pointer w-10 h-10"
                    onClick={() => setIsFilterOpen(true)}
                  />
                )}
                {isFilterOpen && (
                  <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                    <p className="text-secondBlue font-bold p-2">Sort by</p>
                    <div className="border-t border-gray-300">
                      <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">
                        Name
                      </p>
                      <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">
                        ID
                      </p>
                      <p className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2">
                        Issued Date
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ValidationCertificateTable
            data={certificateData.slice(0, 5)}
            onAccept={(id) => handleValidation("certificate", id)}
            onReject={(id) => handleValidation("certificate", id)}
          />

          <div className="flex justify-end mt-4">
            <a
              href="/validation/certificate"
              className="text-black underline cursor-pointer text-sm sm:text-base"
            >
              See All Validation
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ValidationPage;
