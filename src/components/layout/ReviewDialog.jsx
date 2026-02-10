// efortech_edu\src\components\layout\ReviewDialog.jsx
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

const StarRating = ({ rating, onRate, readonly = false }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((index) => (
            <button
                key={index}
                type="button"
                onClick={() => !readonly && onRate(index)}
                className="focus:outline-none transition-transform hover:scale-110"
                disabled={readonly}
            >
                <Star
                    size={36}
                    fill={index <= rating ? "#FBBF24" : "none"}
                    stroke="#FBBF24"
                    className="transition-colors"
                />
            </button>
        ))}
    </div>
);

export default function ReviewDialog({
    open,
    onClose,
    registrationParticipantId,
    trainingName,
    trainingDate,
}) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [isReadonly, setIsReadonly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Fetch existing review when dialog opens
    useEffect(() => {
        if (open && registrationParticipantId) {
            fetchReview();
        } else {
            // Reset form when dialog closes
            setRating(5);
            setReview("");
            setReviewError("");
            setIsReadonly(false);
        }
    }, [open, registrationParticipantId]);

    const fetchReview = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/${registrationParticipantId}`
            );
            const result = await res.json();

            if (res.ok && result.data) {
                // Review exists - show in readonly mode
                setRating(result.data.score);
                setReview(result.data.review_description);
                setIsReadonly(true);
            } else {
                // No review yet - allow user to write
                setRating(5);
                setReview("");
                setIsReadonly(false);
            }
        } catch (err) {
            console.error("Error fetching review:", err);
            setIsReadonly(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (review.trim() === "") {
            setReviewError("Please write your review before submitting.");
            return;
        }

        setReviewError("");
        setLoading(true);

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
                setShowSuccessDialog(true);
            } else {
                toast.error("Failed to submit review: " + result.message);
            }
        } catch (err) {
            console.error("Submit review error:", err);
            toast.error("An error occurred while submitting your review");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessDialog(false);
        onClose(); // Close the review dialog and refresh parent data
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl">
                            {isReadonly ? "Your Review" : "How was your experience?"}
                        </DialogTitle>

                        {trainingName && (
                            <div className="text-left pt-2">
                                <div className="bg-neutral1 rounded-lg p-3 mt-2">
                                    <p className="font-semibold text-gray-800">{trainingName}</p>
                                    <p className="text-sm text-neutral3">
                                        Training Date:{" "}
                                        {new Date(trainingDate).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </DialogHeader>

                    {loading ? (
                        <div className="py-8 text-center">
                            <p className="text-neutral3">Loading...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                    Rating
                                </label>
                                <StarRating
                                    rating={rating}
                                    onRate={setRating}
                                    readonly={isReadonly}
                                />
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    className={`w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 resize-none ${isReadonly
                                        ? "bg-neutral1 border-neutral2 cursor-not-allowed"
                                        : "border-mainOrange focus:ring-mainOrange"
                                        }`}
                                    placeholder="Share your experience with this training..."
                                    value={review}
                                    onChange={(e) => {
                                        setReview(e.target.value);
                                        if (reviewError) setReviewError("");
                                    }}
                                    readOnly={isReadonly}
                                />
                                {reviewError && (
                                    <p className="text-sm text-error1 mt-1">{reviewError}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="w-full sm:w-auto"
                                >
                                    {isReadonly ? "Close" : "Cancel"}
                                </Button>
                                {!isReadonly && (
                                    <Button
                                        type="submit"
                                        variant="orange"
                                        disabled={loading}
                                        className="w-full sm:w-auto"
                                    >
                                        {loading ? "Submitting..." : "Submit Review"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <SuccessDialog
                open={showSuccessDialog}
                onOpenChange={handleSuccessClose}
                title="Thank You!"
                messages={[
                    "Your review has been submitted successfully.",
                    "Have a great day!",
                ]}
                buttonText="Okay"
            />
        </>
    );
}