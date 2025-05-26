"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { NotFound } from "../../../../components/ui/ErrorPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await getIdToken(currentUser);
        setUser(currentUser);
      }
    };
    fetchUser();
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
          console.log("Reviews:", data.data);
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

  const handleEnrollClick = () => {
    if (!user) {
      // Redirect to login page if not logged in
      router.push(`/auth/signin?redirect=/training/${id}/registration`);
    } else {
      // If logged in, proceed to registration page
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
    <div className="overflow-x-hidden">
      <div className="mx-auto p-4 md:p-8 max-w-screen-xl">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Image Slider */}
          <div className="relative w-full max-w-full xl:max-w-[800px] aspect-[4/3] flex-shrink-0 overflow-hidden rounded-lg shadow-md">
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

          {/* Training Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-blue-900 break-words">
              {trainingData.training_name}
            </h1>
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              {trainingData.discount && trainingData.discount > 0 ? (
                <>
                  <p className="text-lg line-through text-gray-500 font-semibold">
                    Rp{" "}
                    {parseInt(trainingData.training_fees).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                  <p className="text-xl text-mainOrange font-bold">
                    Rp{" "}
                    {parseInt(trainingData.final_price).toLocaleString("id-ID")}
                  </p>
                </>
              ) : (
                <p className="text-xl text-black font-semibold">
                  Rp{" "}
                  {parseInt(trainingData.training_fees).toLocaleString("id-ID")}
                </p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-lg text-mainOrange font-bold">Level</p>
                <p className="text-sm text-black font-semibold">
                  {trainingData.level === 1
                    ? "Beginner"
                    : trainingData.level === 2
                    ? "Intermediate"
                    : "Advanced"}
                </p>
              </div>
              <div>
                <p className="text-lg text-mainOrange font-bold">
                  Certificate Validity
                </p>
                <p className="text-sm text-black font-semibold">
                  {trainingData.validity_period
                    ? `${trainingData.validity_period} ${
                        trainingData.validity_period > 1 ? "Months" : "Month"
                      }`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {trainingData.skills.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-sm border rounded-lg break-words max-w-full ${
                    index % 2 === 0
                      ? "border-mainOrange text-black"
                      : "border-mainBlue text-black"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-lg text-mainOrange font-bold">Duration</p>
                <p className="text-sm text-black font-semibold">
                  {trainingData.duration}{" "}
                  {trainingData.duration > 1 ? "Hours" : "Hour"}
                </p>
              </div>
              <div>
                <p className="text-lg text-mainOrange font-bold">
                  Available Date
                </p>
                <p className="text-sm text-black font-semibold">
                  Working Hours (by request)
                </p>
              </div>
            </div>

            <div className="mt-4 max-w-full">
              <p className="text-lg text-mainOrange font-bold">Description</p>
              <div className="max-h-40 overflow-hidden hover:overflow-y-auto custom-scroll pr-2">
                <p className="text-xs text-black leading-relaxed text-justify">
                  {trainingData.description}
                </p>

                <div className="mt-4">
                  <p className="text-lg text-mainOrange font-bold">
                    Terms & Conditions
                  </p>
                  <div className="text-xs text-black pr-4 leading-relaxed text-justify">
                    {trainingData.term_condition ? (
                      <ul>
                        {trainingData.term_condition
                          .split(".")
                          .filter((term) => term.trim() !== "")
                          .map((term, index) => (
                            <li key={index} className="list-inside list-disc">
                              {term.trim()}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      "No terms provided."
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={handleEnrollClick}
                className="px-6 py-1 border-2 border-mainOrange text-mainOrange font-semibold rounded-lg w-full md:w-[300px] transition duration-300 ease-in-out hover:bg-mainOrange hover:text-white active:scale-95"
              >
                Enroll Now
              </button>
              <button
                onClick={() =>
                  (window.location.href =
                    "mailto:info@efortechsolutions.com?subject=Question%20about%20Training%20Registration%20at%20Efortech&body=Dear%20Efortech%20Team,%0D%0A%0D%0AI%20hope%20this%20message%20finds%20you%20well.%0D%0A%0D%0AI%20would%20like%20to%20ask%20for%20further%20information%20regarding%20the%20training%20registration.%20Could%20you%20please%20provide%20more%20details%20about%20the%20process%20or%20requirements?%0D%0A%0D%0AThank%20you%20in%20advance%20for%20your%20assistance.%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]")
                }
                className="px-6 py-1 border-2 border-mainOrange text-mainOrange font-semibold rounded-lg w-full md:w-[300px] transition duration-300 ease-in-out hover:bg-mainOrange hover:text-white active:scale-95"
              >
                Ask by Email
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 border-2 border-mainBlue p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <h2 className="w-full md:w-auto">
              <span className="text-2xl font-bold text-mainOrange">Review</span>{" "}
              <span className="text-xl text-black drop-shadow font-semibold">
                ⭐ {averageRating} / 5.00
              </span>{" "}
              <span className="text-xl text-gray-500">({reviews.length})</span>
            </h2>

            <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
              {/* Sort Order Select */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Sort by Newest</SelectItem>
                  <SelectItem value="oldest">Sort by Oldest</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Rating Select */}
              <Select
                value={filterRating?.toString() || "all"}
                onValueChange={(value) =>
                  setFilterRating(value === "all" ? null : Number(value))
                }
              >
                <SelectTrigger className="w-full md:w-[180px]">
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
            <div className="mt-4 max-h-[300px] overflow-y-auto pr-4 custom-scroll">
              {sortedReviews.map((review, index) => (
                <div
                  key={index}
                  className="mt-4 border-b pb-4 flex items-start gap-4"
                >
                  <Image
                    src={review.user_photo || "/default-avatar.png"}
                    alt={review.fullname}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <div>
                    <p className="text-black text-lg font-semibold">
                      {review.fullname}
                    </p>
                    <p className="text-black text-lg">
                      {review.score.toFixed(2)} / 5.00 ⭐
                    </p>
                    <p className="text-black text-sm">
                      {review.review_description}
                    </p>
                    {/* Tampilkan tanggal review */}
                    <p className="text-sm text-gray-500 pt-2">
                      {new Date(review.review_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDetail;
