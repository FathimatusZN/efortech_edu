"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { articles } from "./data";
import ArticleCard from "@/components/layout/ArticleCard";

const categories = ["All", "Event", "Success Story", "Education", "Blog"];

const carouselImages = [
  { id: 1, src: "/assets/dashboard-bg.png", title: "6 Cara Digital Twin Mengubah Industri Manufaktur" },
  { id: 2, src: "/assets/Gambar2.jpg", title: "Transformasi Digital dalam Era Industri 4.0" },
  { id: 3, src: "/images/slide3.jpg", title: "Bagaimana Digital Twin Meningkatkan Efisiensi?" },
];

export default function ArticlePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

      const mainOrange = "#FF6600";

  return (
    <div className="max-w-screen w-full relative mx-auto">
      {/* CAROUSEL / SLIDER */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
        }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-[446px] md:h-[336px] overflow-hidden shadow-lg"
      >
        {carouselImages.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <img
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end justify-items-start text-white text-center p-6">
              <h1 className="text-xl md:text-3xl font-bold">{slide.title}</h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination DI LUAR gambar */}
      <div className="custom-pagination flex justify-center mt-4"></div>

      {/* Styling Pagination dengan Tailwind */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background-color: #f97316;
          opacity: 0.6;
          transition: all 0.3s ease;
          margin: 0 6px;
          border-radius: 50%;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }
      `}</style>

      {/* FILTER DROPDOWN */}
      <div className="mt-6 flex justify-center">
        <select
          className="w-full md:w-1/3 py-2 px-4 border border-mainOrange focus:border-mainOrange rounded-full shadow-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* GRID ARTIKEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-8 p-8 max-w-max mx-auto">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

    </div>
  );
}