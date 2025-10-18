"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { toast } from "react-hot-toast";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const StarRating = ({ rating, onRate, readonly = false }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[1, 2, 3, 4, 5].map((index) => (
      <button
        key={index}
        type="button"
        onClick={() => !readonly && onRate(index)}
        className="focus:outline-none"
        disabled={readonly}
      >
        <Star
          size={36}
          fill={index <= rating ? "#FBBF24" : "none"}
          stroke="#FBBF24"
        />
      </button>
    ))}
  </div>
);

export default function FeedbackForm() {
  const { id: registrationParticipantId } = useParams();
  const searchParams = useSearchParams();
  const readonlyParam = searchParams.get("readonly");

  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isReadonly, setIsReadonly] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // tambahan: data training
  const [trainingDetail, setTrainingDetail] = useState(null);
  const [certificateNumber, setCertificateNumber] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setShowLoginModal(true);
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (readonlyParam === "true") {
      setIsReadonly(true);
    }
  }, [readonlyParam]);

  // fetch review kalau readonly
  useEffect(() => {
    if (isReadonly) {
      const fetchReview = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/${registrationParticipantId}`
          );
          const result = await res.json();

          if (res.ok) {
            setReviewData(result.data);
            setRating(result.data.score);
            setReview(result.data.review_description);
          }
        } catch (err) {
          console.error("Error fetch review:", err);
        }
      };
      fetchReview();
    }
  }, [isReadonly, registrationParticipantId]);

  // fetch detail training
  useEffect(() => {
    if (!registrationParticipantId) return;

    const fetchTraining = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/search?query=${registrationParticipantId}`;
        console.log("Fetching training detail from:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const result = await res.json();
        console.log("Training detail result:", result);
        if (result.data && result.data.length > 0) {
          const detail = result.data[0];
          setTrainingDetail({
            training_name: detail.training_name,
            training_date: detail.training_date,
          });
          setCertificateNumber(detail.certificate_number);
        }
      } catch (err) {
        console.error("Error fetch training detail:", err);
      }
    };
    fetchTraining();
  }, [registrationParticipantId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (review.trim() === "") {
      setReviewError("This field must be filled.");
      return;
    } else {
      setReviewError("");
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registration_participant_id: registrationParticipantId,
            score: rating,
            review_description: review,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setIsDialogOpen(true);
        setRating(5);
        setReview("");
      } else {
        toast("Gagal submit review: " + result.message);
      }
    } catch (err) {
      console.error("Terjadi error:", err);
      alert("Terjadi kesalahan saat submit review");
    }
  };

  return (
    <>
      {showLoginModal ? (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">
              You need to sign in
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please sign in to continue leaving a review.
            </p>
            <button
              onClick={() =>
                router.push(
                  `/auth/signin?redirect=/edit-profile/review/${registrationParticipantId}`
                )
              }
              className="bg-mainOrange text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl"
          >
            {/* detail training */}
            {trainingDetail && (
              <div className="mb-6 text-center">
                <h3 className="text-lg font-bold text-gray-800">
                  {trainingDetail.training_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Training Date:{" "}
                  {new Date(trainingDetail.training_date).toLocaleDateString()}
                </p>
              </div>
            )}

            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              How was your experience?
            </h2>

            <StarRating rating={rating} onRate={setRating} />

            <label className="block text-left font-medium text-black mb-1">
              Review
            </label>
            <textarea
              className="w-full h-32 p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400 resize-none"
              placeholder="Write your review here.."
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                if (reviewError) setReviewError("");
              }}
              readOnly={isReadonly}
            />
            {reviewError && (
              <p className="text-sm text-red-500 mt-1">{reviewError}</p>
            )}

            {!isReadonly && (
              <div className="flex justify-center mt-6">
                <Button type="submit" variant="orange">
                  Submit Review
                </Button>
              </div>
            )}
          </form>

          <SuccessDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open && certificateNumber) {
                router.push(`/edit-profile`);
              }
            }}
            title="Thank You!"
            messages={[
              "Your review has been submitted.",
              "Have a great day!",
            ]}
            buttonText="Okay"
          />
        </div>
      )}
    </>
  );
}
