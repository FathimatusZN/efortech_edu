// efortech_edu/src/components/layout/TrainingHistoryCard.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TrainingHistoryCard({
  registrationParticipantId,
  images = [],
  trainingName,
  status,
  hasCertificate = false,
  attendanceStatus = null,
  trainingDate,
}) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleViewDetails = () => {
    router.push(`/mytraining/${registrationParticipantId}`);
  };

  const getStatusBadge = () => {
    if (status === "pending") {
      return (
        <div className="absolute top-3 right-3 bg-neutral3/90 text-white text-xs font-medium px-3 py-1 rounded-full">
          Pending Review
        </div>
      );
    }

    if (status === "waiting for payment") {
      return (
        <div className="absolute top-3 right-3 bg-mainOrange/90 text-white text-xs font-medium px-3 py-1 rounded-full">
          Action Required
        </div>
      );
    }

    if (status === "validated") {
      return (
        <div className="absolute top-3 right-3 bg-mainBlue/90 text-white text-xs font-medium px-3 py-1 rounded-full">
          Validated
        </div>
      );
    }

    if (status === "completed") {
      if (attendanceStatus === false) {
        return (
          <div className="absolute top-3 right-3 bg-error1/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            Absent
          </div>
        );
      }

      if (hasCertificate) {
        return (
          <div className="absolute top-3 right-3 bg-success1/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            Certified
          </div>
        );
      }

      return (
        <div className="absolute top-3 right-3 bg-mainOrange/90 text-white text-xs font-medium px-3 py-1 rounded-full">
          In Progress
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white w-full max-w-[500px] border-2 border-mainBlue rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* Image slider */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              loading="lazy"
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {getStatusBadge()}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full border-2 transition-all ${currentSlide === index ? "border-mainOrange" : "border-gray-400"
                  }`}
              >
                <div
                  className={`w-1 h-1 rounded-full mx-auto mt-[2px] ${currentSlide === index ? "bg-mainOrange" : "bg-transparent"
                    }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-blue-900 my-3 line-clamp-2 min-h-[3.5rem]">
          {trainingName}
        </h2>

        <div className="text-xs text-gray-500 mb-3">
          <span className="font-medium">Training date:</span>{" "}
          {formatDate(trainingDate)}
        </div>

        <Button variant="orange" className="w-full" onClick={handleViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
}
