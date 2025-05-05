"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

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
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isReadonly, setIsReadonly] = useState(false); // Track read-only mode
  const [reviewData, setReviewData] = useState(null); // To store fetched review data

  const searchParams = useSearchParams();
  const readonlyParam = searchParams.get("readonly");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        alert("Gagal submit review: " + result.message);
      }
    } catch (err) {
      console.error("Terjadi error:", err);
      alert("Terjadi kesalahan saat submit review");
    }
  };

  useEffect(() => {
    if (readonlyParam === "true") {
      setIsReadonly(true); // Set readonly mode
    }
  }, [readonlyParam]);

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
            console.log("Review data:", result.data);
          } else {
            alert("Gagal mengambil review: " + result.message);
          }
        } catch (err) {
          console.error("Error fetch review:", err);
          alert("Terjadi kesalahan saat mengambil data review.");
        }
      };
      fetchReview();
    }
  }, [isReadonly, registrationParticipantId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl"
      >
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
          onChange={(e) => setReview(e.target.value)}
          readOnly={isReadonly}
        />

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
        onOpenChange={setIsDialogOpen}
        title="Thank You!"
        messages={["Your review has been submitted.", "Have a great day!"]}
        buttonText="Okay"
      />
    </div>
  );
}
