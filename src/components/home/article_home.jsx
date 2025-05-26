"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import "swiper/css";

const categoryOptions = [
  { id: 0, label: "All" },
  { id: 1, label: "Education" },
  { id: 2, label: "Event" },
  { id: 3, label: "Success Story" },
  { id: 4, label: "Blog" },
];

const getCategoryLabel = (id) => {
  return categoryOptions.find((c) => c.id === id)?.label || "Unknown";
};

export default function ArticleSection({ highlightArticles }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-base md:text-3xl font-bold mt-10">
          Educational Article Highlight
        </h2>
        <Link
          href="/article"
          className="text-xs md:text-sm text-gray-600 hover:underline flex items-center gap-1 mt-14"
        >
          See All <FaAngleRight className="text-xs" />
        </Link>
      </div>

      <Swiper
        key={highlightArticles.length}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Autoplay]}
      >
        {highlightArticles.map((article) => (
          <SwiperSlide key={article.article_id}>
            <Link href={`/article/${article.article_id}`}>
              <Card className="p-0 bg-transparent shadow-none border-none mt-4">
                <img
                  src={article.images?.[0] || "/assets/Gambar2.jpg"}
                  alt={article.title}
                  className="h-60 w-full object-cover rounded-tl-2xl cursor-pointer shadow-lg"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-black text-base mb-2 text-left">
                    {article.title}
                  </h3>
                  <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                    <p>Category: {getCategoryLabel(article.category)}</p>
                    <p>Views: {article.views}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags?.map((tag, tagIdx) => (
                      <div
                        key={tagIdx}
                        className="border border-mainOrange text-black rounded-lg px-3 py-1 text-xs"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}