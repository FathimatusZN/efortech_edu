"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ValidationTrainingTable } from "@/components/admin/ValidationTrainingTable";
import { ValidationCertificateTable } from "@/components/admin/ValidationCertificateTable";
import { AdditionalParticipantDialog } from "@/components/admin/AdditionalParticipantDialog";

const ValidationPage = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainingData = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/search?status=1&status=2&status=3`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch training data");
      const result = await res.json();
      setTrainingData(result?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load training data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificateData = async () => {
    // placeholder: replace with actual API if needed
    setCertificateData([]);
  };

  useEffect(() => {
    fetchTrainingData();
    fetchCertificateData();
  }, []);

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
      fetchTrainingData();
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  // Function to handle showing participants in a dialog
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const onShowDetailRegistration = (registration) => {
    setSelectedRegistration(registration);
    setIsDetailDialogOpen(true);
  };


  const handleCertificateValidation = (type, id) => {
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

        {/* Training Registration Validation */}
        <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#157ab2]">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Training Registration Validation
          </h2>

          <AdditionalParticipantDialog
            open={selectedRegistration !== null}
            onClose={() => setSelectedRegistration(null)}
            registration={selectedRegistration}
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidationTrainingTable
              data={trainingData.slice(0, 5)}
              mode="needprocess"

              onShowDetailRegistration={onShowDetailRegistration}
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
        <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#157ab2]">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Certificate Validation
          </h2>

          <ValidationCertificateTable
            data={certificateData.slice(0, 5)}
            onAccept={(id) => handleCertificateValidation("certificate", id)}
            onReject={(id) => handleCertificateValidation("certificate", id)}
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
