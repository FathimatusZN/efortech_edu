"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BsCheckCircleFill } from 'react-icons/bs';

const StarRating = ({ rating, onRate }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[1, 2, 3, 4, 5].map((index) => (
        <button
            key={index}
            type="button" // ⬅️ Fix ada di sini!
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

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl border-4 border-mainBlue text-center p-10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-black mb-2">
                Thank You
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your review has been submitted
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-6">
              <BsCheckCircleFill size={80} fill="#6DB73C" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
