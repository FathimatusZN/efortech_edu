"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TrainingDetail = () => {
  const { id } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterRating, setFilterRating] = useState(null);
  const router = useRouter();

  const trainingData = {
    title: "Accelerating Digital O&M using DeviceOn/BI and Patrol Inspection",
    price: "Rp 2.300.000",
    level: "Beginner",
    certificate: "3 years",
    tags: [
      "Risk Management",
      "Quality Management",
      "Cost & Budget Management",
      "Scope Management",
      "Project Planning & Scheduling",
    ],
    duration: "10 Hours",
    date: "23 February 2025 - 13 March 2025",
    description:
      `This training program is designed to provide an in-depth understanding of project management principles, including risk management, quality control, and budget planning. Participants will explore real-world case studies, best practices, and interactive exercises to enhance their skills.

      The course covers:
      - Introduction to Project Management
      - Effective Stakeholder Communication
      - Budget Planning and Cost Management
      - Risk Assessment and Mitigation Strategies
      - Agile and Waterfall Methodologies

      By the end of this course, participants will be equipped with the necessary knowledge and tools to successfully manage projects, mitigate risks, and optimize resources. This training is ideal for professionals looking to enhance their project management capabilities.

      Additionally, this course provides hands-on experience through group discussions, case study analysis, and scenario-based exercises, ensuring participants can apply their knowledge effectively in real-world scenarios.

      Join us today and take your project management skills to the next level!`,
    images: [
      "/assets/gambar1.jpg",
      "/assets/Gambar2.jpg",
      "/assets/dashboard-bg.png",
    ],
    reviews: [
      { name: "Thom Haye", rating: 5.00, comment: "Training yang sangat bermanfaat!", avatar: "https://source.unsplash.com/50x50/?man" },
      { name: "Rachel Venya", rating: 4.00, comment: "Sangat direkomendasikan untuk pemula.", avatar: "https://source.unsplash.com/50x50/?woman" },
      { name: "Thom Haye", rating: 5.00, comment: "Pelatihan yang luar biasa!", avatar: "https://source.unsplash.com/50x50/?man" },
      { name: "Rachel Venya", rating: 4.00, comment: "Sangat direkomendasikan untuk pemula.", avatar: "https://source.unsplash.com/50x50/?woman" },
      { name: "Thom Haye", rating: 3.00, comment: "Training yang sangat bermanfaat!", avatar: "https://source.unsplash.com/50x50/?man" },
      { name: "Rachel Venya", rating: 4.00, comment: "Sangat direkomendasikan untuk pemula.", avatar: "https://source.unsplash.com/50x50/?woman" },
      { name: "Thom Haye", rating: 5.00, comment: "Pelatihan yang luar biasa!", avatar: "https://source.unsplash.com/50x50/?man" },
      { name: "Rachel Venya", rating: 4.00, comment: "Sangat direkomendasikan untuk pemula.", avatar: "https://source.unsplash.com/50x50/?woman" },  
    ],
  };

  const averageRating = (
    trainingData.reviews.reduce((acc, review) => acc + review.rating, 0) /
    trainingData.reviews.length
  ).toFixed(2);

  const sortedReviews = [...trainingData.reviews]
    .filter(review => (filterRating ? review.rating === filterRating : true))
    .sort((a, b) => (sortOrder === "newest" ? b.rating - a.rating : a.rating - b.rating));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trainingData.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trainingData.images.length]);

  return (
    <div className="mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-[800px] h-[300px] md:h-[580px] overflow-hidden rounded-lg shadow-md">
          {trainingData.images.map((img, index) => (
            <Image
              key={index} 
              src={img}
              alt={`Slide ${index + 1}`}
              width={800}
              height={500}
              className={`absolute transition-opacity duration-1000 w-full h-full object-cover ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {trainingData.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                  currentSlide === index ? "border-mainOrange" : "border-gray-400"
                }`}
              >
                <div
                  className={`w-1 h-1 rounded-full ${
                    currentSlide === index ? "bg-mainOrange" : "bg-transparent"
                  }`}
                ></div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-blue-900">{trainingData.title}</h1>
          <p className="text-xl text-black font-semibold pt-2">{trainingData.price}</p>
          <div className="mt-4 flex w-full md:w-2/3 grid grid-cols-3">
            <div className="flex-1">
              <p className="text-lg text-mainOrange font-bold whitespace-nowrap">Level</p>
              <p className="text-sm text-black font-semibold whitespace-nowrap">{trainingData.level}</p>
            </div>
            <div className="flex-1">
              <p className="text-lg text-mainOrange font-bold whitespace-nowrap">Certificate Validation</p>
              <p className="text-sm text-black font-semibold whitespace-nowrap">{trainingData.certificate}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {trainingData.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-sm border rounded-lg ${
                  index % 2 === 0 ? "border-mainOrange text-black" : "border-mainBlue text-black"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex w-full md:w-2/3 grid grid-cols-3">
            <div className="flex-1">
              <p className="text-lg text-mainOrange font-bold whitespace-nowrap">Duration</p>
              <p className="text-sm text-black font-semibold whitespace-nowrap">{trainingData.duration}</p>
            </div>
            <div className="flex-1">
              <p className="text-lg text-mainOrange font-bold whitespace-nowrap">Date</p>
              <p className="text-sm text-black font-semibold whitespace-nowrap">{trainingData.date}</p>
            </div>
          </div>
          <div className="mt-4 max-w-2xl">
            <p className="text-lg text-mainOrange font-bold">Description</p>
            <div className="max-h-40 overflow-hidden hover:overflow-y-auto custom-scroll">
              <p className="text-xs text-black pr-4 leading-relaxed text-justify">
                {trainingData.description}
              </p>
            </div>
          </div>
          <div 
             onClick={() => router.push("/training/registration")}
            className="mt-4 flex gap-4 w-full">
            <button className="px-6 py-1 border-2 border-mainOrange text-mainOrange font-semibold rounded-lg w-full md:w-[310px] 
            transition duration-300 ease-in-out hover:bg-mainOrange hover:text-white active:scale-95"> 
              Enroll Now
            </button>
            <button 
              onClick={() => window.location.href = "mailto:tafdhilaanadya@gmail.com"}
              className="px-6 py-1 border-2 border-mainOrange text-mainOrange font-semibold rounded-lg w-full md:w-[310px] 
              transition duration-300 ease-in-out hover:bg-mainOrange hover:text-white active:scale-95">
              Ask by Email
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border border-2 border-mainBlue p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
        <h2 className="w-full md:w-auto">
          <span className="text-2xl font-bold text-mainOrange">Review</span>{" "}
          <span className=" text-xl text-black drop-shadow font-semibold">⭐ {averageRating} / 5.00</span>{" "}
          <span className="text-xl text-gray-500">({trainingData.reviews.length})</span>
        </h2>
        <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <select onChange={(e) => setSortOrder(e.target.value)} className="border p-2 rounded w-full md:w-auto">
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
          <select onChange={(e) => setFilterRating(Number(e.target.value) || null)} className="border p-2 rounded w-full md:w-auto">
            <option value="">Filter by Rating</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>
        </div>
      </div>
      <div className="mt-4 max-h-[300px] overflow-y-auto pr-4 custom-scroll">
        {sortedReviews.map((review, index) => (
          <div key={index} className="mt-4 border-b pb-4 flex items-start gap-4">
            <Image src={review.avatar} alt={review.name} width={50} height={50} className="rounded-full" />
            <div>
              <p className="text-black text-lg font-semibold">{review.name}</p>
              <p className="text-black text-lg">{review.rating.toFixed(2)} / 5.00 ⭐</p>
              <p className="text-black text-sm">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default TrainingDetail;
