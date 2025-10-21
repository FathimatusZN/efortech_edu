"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import UploadPaymentDialog from "./UploadPaymentDialog";
import UploadCertificateDialog from "./UploadCertificateDialog";

export default function TrainingHistoryCard({
  registrationId,
  trainingId,
  registrationParticipantId,
  images,
  trainingName,
  status: initialStatus,
  hasReview = false,
  hasCertificate = false,
  attendanceStatus = null,
}) {
  const router = useRouter();

  const [status, setStatus] = useState(initialStatus);
  const [isCertificateUploaded, setIsCertificateUploaded] = useState(false);
  const [isUploadCertDialogOpen, setIsUploadCertDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images?.length) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images?.length]);

  const handleUploadCertificate = () => setIsUploadCertDialogOpen(true);
  const handleUploadPayment = () => setIsUploadDialogOpen(true);

  const handleWriteReview = () => {
    const path = hasReview
      ? `/edit-profile/review/${registrationParticipantId}?readonly=true`
      : `/edit-profile/review/${registrationParticipantId}`;
    router.push(path);
  };

  const handleDownloadCertificate = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/download/${registrationParticipantId}`
      );

      if (!res.ok) throw new Error("Failed to download");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate - ${trainingName}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert("An error occurred while downloading the certificate.");
    }
  };

  // === RENDER BUTTONS ===
  const renderButtons = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <Button variant="orange" className="w-full" disabled>
              Upload Payment Proof
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/training/${trainingId}`)}
            >
              See Details
            </Button>
          </>
        );

      case "waiting for payment":
        return (
          <>
            <Button
              variant="orange"
              className="w-full"
              onClick={handleUploadPayment}
            >
              Upload Payment Proof
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/training/${trainingId}`)}
            >
              See Details
            </Button>
          </>
        );

      case "validated":
        return (
          <div className="flex flex-col items-center w-full gap-2">
            <p className="text-white font-medium border-blue-900 bg-blue-900 rounded-md px-4 py-2 w-full text-center">
              Registration Validated
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/training/${trainingId}`)}
            >
              See Details
            </Button>
          </div>
        );

      case "completed":
        // Kondisi 1: belum ada attendance status
        if (attendanceStatus === null) {
          return (
            <div className="flex flex-col items-center w-full gap-2">
              <Button
                variant="ghost"
                className="border-2 border-lightBlue w-full"
                disabled
              >
                Review
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/training/${trainingId}`)}
              >
                See Details
              </Button>
            </div>
          );
        }

        // Kondisi 2: sudah ada attendanceStatus == true tapi belum review
        if (attendanceStatus === true && !hasReview) {
          return (
            <div className="flex flex-col items-center w-full gap-2">
              <Button
                variant="ghost"
                className="border-2 border-lightBlue w-full"
                onClick={handleWriteReview}
              >
                Review
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/training/${trainingId}`)}
              >
                See Details
              </Button>
            </div>
          );
        }

        // Kondisi 3: sudah menulis review
        if (hasReview) {
          return (
            <div className="flex flex-col items-center w-full gap-2">
              <Button
                variant="orange"
                className="w-full"
                onClick={handleUploadCertificate}
                disabled={isCertificateUploaded || !attendanceStatus}
              >
                {isCertificateUploaded
                  ? "Certificate Uploaded"
                  : "Upload Advantech Certificate"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleWriteReview}
                className="border-2 border-lightBlue w-full"
              >
                {" "}
                Review{" "}
              </Button>
              <Button
                variant="lightBlue"
                className="w-full"
                onClick={handleDownloadCertificate}
                disabled={!hasCertificate}
              >
                Download Certificate
              </Button>
            </div>
          );
        }

        // Kondisi 4: attendanceStatus == false
        if (attendanceStatus === false) {
          return (
            <div className="flex flex-col items-center w-full gap-2">
              <p className="text-white font-medium border-red-600 bg-red-600 rounded-md px-4 py-2 w-full text-center">
                Absent
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/training/${trainingId}`)}
              >
                See Details
              </Button>
            </div>
          );
        }

        break;

      default:
        return (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/training/${trainingId}`)}
          >
            See Details
          </Button>
        );
    }
  };

  return (
    <div className="bg-white w-full max-w-[5000px] max-h-[520px] border-2 border-mainBlue rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      <div className="relative w-full h-[240px] overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute transition-opacity duration-1000 w-full h-full object-cover ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full border-2 flex justify-center items-center transition-all ${
                currentSlide === index ? "border-mainOrange" : "border-gray-400"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full items-center ${
                  currentSlide === index ? "bg-mainOrange" : "bg-transparent"
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-blue-900 my-3 line-clamp-2 break-words">
          {trainingName}
        </h2>

        {renderButtons()}
      </div>

      <UploadPaymentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        registrationId={registrationId}
      />

      <UploadCertificateDialog
        open={isUploadCertDialogOpen}
        onOpenChange={setIsUploadCertDialogOpen}
        registrationParticipantId={registrationParticipantId}
        registrationId={registrationId}
        onSuccess={() => {
          setIsCertificateUploaded(true);
          setIsUploadCertDialogOpen(false);
        }}
      />
    </div>
  );
}
