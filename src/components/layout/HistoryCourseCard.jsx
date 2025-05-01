"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function HistoryCourseCard({
  id,
  trainingId,
  images,
  title,
  status,
  hasReview = false,
  hasCertificate = false,
}) {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images?.length) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images?.length]);

  const handleWriteReview = () => {
    router.push(`/edit-profile/review/${id}`);
  };

  const handleUploadPayment = () => {
    router.push(`/training/${id}/upload-payment`);
  };

  const renderButtons = () => {
    switch (status) {
      case "pending":
      case "waiting for payment":
        return (
          <>
            <Button
              variant="orange"
              className="w-full"
              disabled={status === "pending"} // Disabled hanya kalau "pending"
              onClick={handleUploadPayment}
            >
              Upload Bukti Pembayaran
            </Button>
            <Button variant="outline" className="w-full mt-2">
              <a href={`/training/${trainingId}`}>See Details</a>
            </Button>
          </>
        );

      case "validated":
        return (
          <div className="flex flex-col items-center w-full gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={handleWriteReview}
              className="border-2 border-lightBlue w-full"
              disabled
            >
              Review
            </Button>
            <Button variant="lightBlue" className="w-full" disabled>
              Download Certificate
            </Button>
          </div>
        );

      case "completed":
        return (
          <div className="flex flex-col items-center w-full gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={handleWriteReview}
              className="border-2 border-lightBlue w-full"
              disabled={!hasCertificate}
            >
              Review
            </Button>
            <Button
              variant="lightBlue"
              className="w-full"
              disabled={!hasReview}
            >
              Download Certificate
            </Button>
          </div>
        );

      default:
        return (
          <Button variant="orange" className="w-full">
            <a href={`/training/${trainingId}`}>See Details</a>
          </Button>
        );
    }
  };

  return (
    <div className="bg-white w-full max-w-[5000px] max-h-[433px] border-2 border-mainBlue rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* IMAGE */}
      <div className="relative w-full h-[200px] overflow-hidden">
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

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
        <h2 className="text-lg font-semibold text-blue-900 my-3">{title}</h2>

        {renderButtons()}
      </div>
    </div>
  );
}
