"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { articles } from "./data";
import ArticleCard from "@/components/layout/ArticleCard";

// ✨ Tambahkan import Select dari shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        className="w-full h-[50vh] md:h-[40vh] lg:h-[35vh] overflow-hidden shadow-lg"
      >
        {carouselImages.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <img
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end text-white text-center p-6">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold">{slide.title}</h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination DI LUAR gambar */}
      <div className="custom-pagination flex justify-center mt-4"></div>

      {/* FILTER DROPDOWN */}
      <div className="mt-6 mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-center gap-4">

        <div className="w-full md:w-1/3">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-full rounded-full shadow-lg border-orange-500 focus:ring-orange-600">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GRID ARTIKEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-10 mx-auto max-w-max">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
}