"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
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
          fill={index <= rating ? '#FBBF24' : 'none'}
          stroke="#FBBF24"
        />
      </button>
    ))}
  </div>
);

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDialogOpen(true);

    setRating(5);
    setReview('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          How Was Your Experience?
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
      </form>

      {/* 🔥 Dialog yang udah bener */}
      <SuccessDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Thank You!"
        messages={[
          "Your review has been submitted.",
          "Have a great day!"
        ]}
        buttonText="Okay"
      />
    </div>
  );
}