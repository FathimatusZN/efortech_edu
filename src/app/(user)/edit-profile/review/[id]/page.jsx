"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

const StarRating = ({ rating, onRate }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[1, 2, 3, 4, 5].map((index) => (
      <button
        key={index}
        type="button"
        onClick={() => onRate(index)}
        className="focus:outline-none"
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
  const { id: registrationParticipantId } = useParams(); // ini masih REGT seharusnya REGP
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Training details
  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainingImage, setTrainingImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data training berdasarkan registration_participant_id
  useEffect(() => {
    const fetchTrainingDetail = async () => {
      try {
        setLoading(true);

        // 1. Ambil detail registration (dapatkan training_id)
        const regRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/${registrationParticipantId}`
        );
        const regData = await regRes.json();
        const trainingId = regData.data.training_id;
     

        // 2. Ambil detail training
        const trainingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${trainingId}`
        );
        const trainingData = await trainingRes.json();

        setTrainingTitle(trainingData.data.training_name);
        setTrainingImage(trainingData.data.images?.[0] || "");
      } catch (err) {
        console.error("Gagal mengambil detail training:", err);
      } finally {
        setLoading(false);
      }
    };

    if (registrationParticipantId) {
      fetchTrainingDetail();
    }
  }, [registrationParticipantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration_participant_id: registrationParticipantId,
          score: rating,
          review_description: review,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setIsDialogOpen(true);
        setRating(5);
        setReview("");
      } else {
        console.log("ID:", registrationParticipantId);
        alert("Gagal submit review: " + result.message);
      }
    } catch (err) {
      console.error("Terjadi error:", err);
      alert("Terjadi kesalahan saat submit review");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading training details...</p>
        ) : (
          <>
            {trainingImage && (
              <img
                src={trainingImage}
                alt={trainingTitle}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              How was your experience in <span className="text-orange-500">{trainingTitle}</span>?
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
            />

            <div className="flex justify-center mt-6">
              <Button type="submit" variant="orange">
                Submit Review
              </Button>
            </div>
          </>
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