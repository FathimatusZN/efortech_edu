"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getIdToken } from "firebase/auth";
import { NotFound } from "../../../../components/ui/ErrorPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";

const TrainingDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterRating, setFilterRating] = useState(null);
  const [user, setUser] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [isReviewEmpty, setIsReviewEmpty] = useState(false);

  const [showRegisteredDialog, setShowRegisteredDialog] = useState(false);
  const [registrationInfo, setRegistrationInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getIdToken(currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTrainingDetail = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${id}`
        );
        const data = await res.json();

        if (res.ok && data.data) {
          setTrainingData(data.data);
        } else {
          return (
            <NotFound
              message={"Training Not Found"}
              buttons={[{ text: "Back to Training Page", href: "/training" }]}
            />
          );
        }
      } catch (err) {
        console.error("Error fetching training detail:", err);
        setError("Failed to fetch training.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingDetail();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/search?training_id=${id}`
        );
        const data = await res.json();

        if (res.ok && data.data) {
          if (data.data.length === 0) {
            setIsReviewEmpty(true); // jika review kosong
          } else {
            setReviews(data.data);
            setIsReviewEmpty(false);
          }
        } else {
          console.error("Failed to fetch reviews");
          setIsReviewEmpty(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setIsReviewEmpty(true);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  useEffect(() => {
    if (trainingData?.images?.length) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trainingData.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [trainingData?.images?.length]);

  const handleEnrollClick = async () => {
    if (user === undefined) return;
    if (!user) {
      router.push(`/auth/signin?redirect=/training/${id}/registration`);
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/check/${user.uid}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      console.log("Check registration response:", data);

      const isRegistered = data?.data?.isRegistered === true;

      if (isRegistered) {
        setRegistrationInfo(data.data);
        setShowRegisteredDialog(true);
        return;
      }

      router.push(`/training/${id}/registration`);
    } catch (err) {
      console.error("Check registration error:", err);
      router.push(`/training/${id}/registration`);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-blue-600 font-bold text-xl">
        Loading...
      </div>
    );
  }

  if (error || !trainingData) {
    return (
      <div className="px-10 text-center text-red-600 font-bold text-xl">
        <NotFound
          message={"Training Not Found"}
          buttons={[{ text: "Back to Training Page", href: "/training" }]}
        />
      </div>
    );
  }

  const validScores = reviews
    .map((review) => review.score)
    .filter((score) => typeof score === "number" && !isNaN(score));

  const averageRating = validScores.length
    ? (
        validScores.reduce((acc, score) => acc + score, 0) / validScores.length
      ).toFixed(2)
    : "0.00";

  const sortedReviews = reviews
    .filter((review) =>
      filterRating !== null ? review.score === filterRating : true
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.review_date) - new Date(a.review_date);
      } else {
        return new Date(a.review_date) - new Date(b.review_date);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Image Slider - Full Width 16:9 */}
          <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] overflow-hidden rounded-xl shadow-lg bg-gradient-to-b from-gray-100 to-gray-200">
            {/* Discount Badge */}
            {trainingData.discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-bounce z-10">
                🔥 {Math.floor(trainingData.discount)}% OFF
              </div>
            )}

            {/* Images */}
            {trainingData.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                fill
                className={`object-cover transition-opacity duration-1000 ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {trainingData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                    currentSlide === index
                      ? "border-mainOrange"
                      : "border-gray-400"
                  }`}
                >
                  <div
                    className={`w-1 h-1 rounded-full ${
                      currentSlide === index
                        ? "bg-mainOrange"
                        : "bg-transparent"
                    }`}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Section - White Card */}
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            {/* Title & Price */}
            <div className="border-b pb-6 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4 break-words">
                {trainingData.training_name}
              </h1>

              <div className="flex flex-wrap gap-3 items-center">
                {trainingData.discount && trainingData.discount > 0 ? (
                  <>
                    <span className="text-xl text-gray-400 line-through font-semibold">
                      Rp{" "}
                      {parseInt(trainingData.training_fees).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                    <span className="text-3xl text-mainOrange font-bold">
                      Rp{" "}
                      {parseInt(trainingData.final_price).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                      Save Rp{" "}
                      {(
                        parseInt(trainingData.training_fees) -
                        parseInt(trainingData.final_price)
                      ).toLocaleString("id-ID")}
                    </span>
                  </>
                ) : trainingData.training_fees == 0 ? (
                  <span className="text-3xl font-bold text-green-600">
                    FREE!
                  </span>
                ) : (
                  <span className="text-3xl text-gray-900 font-bold">
                    Rp{" "}
                    {parseInt(trainingData.training_fees).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Key Info Grid - 4 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-mainOrange">
                <p className="text-sm text-gray-600 mb-1">Level</p>
                <p className="text-lg font-bold text-gray-900">
                  {trainingData.level === 1
                    ? "Beginner"
                    : trainingData.level === 2
                    ? "Intermediate"
                    : "Advanced"}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-mainBlue">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {trainingData.duration}{" "}
                  {trainingData.duration > 1 ? "Hours" : "Hour"}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-mainOrange">
                <p className="text-sm text-gray-600 mb-1">
                  Certificate Validity
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {trainingData.validity_period
                    ? `${trainingData.validity_period} ${
                        trainingData.validity_period > 1 ? "Months" : "Month"
                      }`
                    : "No Expiry"}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-mainBlue">
                <p className="text-sm text-gray-600 mb-1">Available Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {trainingData.available_date}
                </p>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                What You'll Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {trainingData.skills.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border-2 ${
                      index % 2 === 0
                        ? "border-mainOrange text-mainOrange bg-orange-50"
                        : "border-mainBlue text-mainBlue bg-blue-50"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Description
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {trainingData.description}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Terms & Conditions
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {trainingData.term_condition ? (
                  trainingData.term_condition
                    .split(".")
                    .filter((t) => t.trim())
                    .map((term, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-mainOrange mt-1">•</span>
                        <span>{term.trim()}</span>
                      </li>
                    ))
                ) : (
                  <li>No terms provided.</li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEnrollClick}
                disabled={trainingData.status === 2}
                className={`flex-1 px-8 py-3 font-bold rounded-lg transition-all ${
                  trainingData.status === 2
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-mainOrange text-white hover:bg-orange-700 shadow-md hover:shadow-lg active:scale-95"
                }`}
              >
                {trainingData.status === 2
                  ? "Training No Longer Available"
                  : "Enroll Now"}
              </button>

              <button
                onClick={() => {
                  const subject = encodeURIComponent(
                    `Inquiry about Training Registration - ${trainingData.training_name}`
                  );

                  const body = encodeURIComponent(
                    `Dear Efortech Team,\n\n` +
                      `I hope this message finds you well.\n\n` +
                      `I'm reaching out to ask for further information regarding the training registration process.\n\n` +
                      `Here are the training details:\n` +
                      `• Training ID   : ${trainingData.training_id}\n` +
                      `• Training Name : ${trainingData.training_name}\n\n` +
                      `Could you please provide more details about the registration process, requirements, or any additional steps?\n` +
                      `[* Feel free to adjust or rephrase this part to match your preferred tone or context.]\n\n` +
                      `Thank you very much for your time and assistance.\n` +
                      `Looking forward to your reply.\n\n` +
                      `Best regards,\n` +
                      `[Your Name]\n` +
                      `[Your Contact Information (optional)]`
                  );

                  window.location.href = `mailto:info@efortechsolutions.com?subject=${subject}&body=${body}`;
                }}
                className="flex-1 px-8 py-3 border-2 border-mainOrange text-mainOrange font-bold rounded-lg hover:bg-mainOrange hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Ask by Email
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-mainOrange mb-2">
                  Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ⭐ {averageRating}
                  </span>
                  <span className="text-gray-500">/ 5.00</span>
                  <span className="text-gray-400">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterRating?.toString() || "all"}
                  onValueChange={(value) =>
                    setFilterRating(value === "all" ? null : Number(value))
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="3">⭐⭐⭐</SelectItem>
                    <SelectItem value="2">⭐⭐</SelectItem>
                    <SelectItem value="1">⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isReviewEmpty ? (
              <NotFound
                message={"This training has no reviews yet."}
                buttons={[]}
              />
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {sortedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b last:border-0 items-start"
                  >
                    <Image
                      src={review.user_photo || "/default-avatar.png"}
                      alt={review.fullname}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">
                          {review.fullname}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.review_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 font-bold">
                          {review.score.toFixed(1)}
                        </span>
                        <span className="text-yellow-500">
                          {"⭐".repeat(Math.floor(review.score))}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.review_description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog
        open={showRegisteredDialog}
        onOpenChange={setShowRegisteredDialog}
      >
        <DialogContent className="w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="text-mainOrange w-10 h-10" />
            </div>
            <DialogTitle className="text-xl font-bold text-mainOrange">
              Already Registered
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              You have already registered for this training. Below are your
              registration details:
            </DialogDescription>
          </DialogHeader>

          {registrationInfo && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 text-sm text-left text-gray-700 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-semibold bg-gray-50 w-1/3">
                      Training
                    </td>
                    <td className="px-4 py-2">
                      {registrationInfo.training_name}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-semibold bg-gray-50">
                      Registration Date
                    </td>
                    <td className="px-4 py-2">
                      {new Date(
                        registrationInfo.registration_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-semibold bg-gray-50">
                      Training Date
                    </td>
                    <td className="px-4 py-2">
                      {new Date(
                        registrationInfo.training_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-semibold bg-gray-50">
                      Status
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        registrationInfo.status_label === "Done"
                          ? "text-green-600"
                          : registrationInfo.status_label === "Cancelled"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {registrationInfo.status_label}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-semibold bg-gray-50">
                      Registration ID
                    </td>
                    <td className="px-4 py-2">
                      {registrationInfo.registration_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold bg-gray-50">
                      Participant ID
                    </td>
                    <td className="px-4 py-2">
                      {registrationInfo.registration_participant_id}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4 text-justify">
            If there was a mistake in your previous registration and you need to
            register again, please contact us at{" "}
            <a
              href="mailto:info@efortechsolutions.com"
              className="text-mainOrange font-semibold hover:underline"
            >
              info@efortechsolutions.com
            </a>
            .
          </p>

          <DialogFooter className="mt-6 flex justify-center gap-4">
            <Button
              onClick={() => {
                setShowRegisteredDialog(false);
                router.push("/edit-profile");
              }}
              className="bg-mainOrange text-white hover:bg-orange-600"
            >
              View My Training
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRegisteredDialog(false)}
            >
              Back to Detail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingDetail;
