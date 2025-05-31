"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ValidationTrainingTable } from "@/components/admin/ValidationTrainingTable";
import { ValidationCertificateTable } from "@/components/admin/ValidationCertificateTable";
import { AdditionalParticipantDialog } from "@/components/admin/AdditionalParticipantDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ValidationPage = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [trainingLoading, setTrainingLoading] = useState(true);
  const [isTrainingFetched, setIsTrainingFetched] = useState(false);

  const [certificateLoading, setCertificateLoading] = useState(true);
  const [isCertificateFetched, setIsCertificateFetched] = useState(false);

  const fetchTrainingData = async () => {
    setTrainingLoading(true);
    setIsTrainingFetched(false);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/search?status=1&status=2&status=3`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch training data");
      const result = await res.json();
      setTrainingData(result?.data || []);
      setIsTrainingFetched(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load training data");
      setIsTrainingFetched(true);
    } finally {
      setTrainingLoading(false);
    }
  };

  const fetchCertificateData = async () => {
    setCertificateLoading(true);
    setIsCertificateFetched(false);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ucertificate/search?status=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch certificate data");
      const result = await res.json();
      setCertificateData(result?.data || []);
      setIsCertificateFetched(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load certificate data");
      setIsCertificateFetched(true);
    } finally {
      setCertificateLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingData();
    fetchCertificateData();
  }, []);

  const handleRegistrationStatusChange = async (registrationId, newStatus) => {
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

  // Function to handle showing preview in a dialog
  const [isDetailCertificateDialogOpen, setIsDetailCertificateDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const onShowDetailCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setIsDetailCertificateDialogOpen(true);
  };

  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.user_id) {
          setAdminId(parsedUser.user_id);
        }
      }
    }
  }, []);

  const handleCertificateStatusChange = async (user_certificate_id, status, notes = "") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ucertificate/update-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_certificate_id,
            status,
            notes,
            admin_id: adminId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      toast.success("Status updated successfully");
      fetchCertificateData();
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
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
          {trainingLoading ? (
            <div className="items-center justify-center">
              <LoadingSpinner className="w-10 h-10" />
            </div>
          ) : !trainingLoading && isTrainingFetched && trainingData.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No data available</p>
          ) : (
            <ValidationTrainingTable
              data={trainingData.slice(0, 5)}
              mode="needprocess"
              onShowDetailRegistration={onShowDetailRegistration}
              onStatusChange={handleRegistrationStatusChange}
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

          {certificateLoading ? (
            <div className="items-center justify-center">
              <LoadingSpinner className="w-10 h-10" />
            </div>
          ) : !certificateLoading && isCertificateFetched && certificateData.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No data available</p>
          ) : (
            <ValidationCertificateTable
              data={certificateData.slice(0, 5)}
              mode="needprocess"
              adminId={adminId}
              onShowDetailCertificate={onShowDetailCertificate}
              onStatusChange={handleCertificateStatusChange}
              disablePagination={true}
            />
          )}

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
