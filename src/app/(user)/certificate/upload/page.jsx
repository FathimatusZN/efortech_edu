"use client";

import UploadCertificateForm from "@/components/layout/UploadCertificateForm";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import React, { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function UploadCertificatePage() {
  const [showDialog, setShowDialog] = useState(false);

  const handleUserSubmit = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ucertificate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to submit certificate");
      }

      setShowDialog(true);
    } catch (error) {
      console.error("Upload failed:", error.message);
      alert("Upload failed: " + error.message);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin", "user"]}>
      <div className="max-w-full mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Upload Certificate
        </h1>

        <UploadCertificateForm onSubmit={handleUserSubmit} mode="user" />

        <SuccessDialog
          open={showDialog}
          onOpenChange={setShowDialog}
        />
      </div>
    </ProtectedRoute>
  );
}
