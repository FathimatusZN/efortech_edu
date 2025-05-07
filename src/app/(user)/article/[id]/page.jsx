"use client";
import { use, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { NotFound } from "../../../../components/ui/ErrorPage";

export default function ArticleDetail({ params }) {
  const { id } = use(params);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/${id}`
        );
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setArticle(json.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (notFound || !article)
    return (
      <NotFound
        message={"Article Not Found"}
        buttons={[{ text: "Back to Articles Page", href: "/article" }]}
      />
    );

  return (
    <div className="max-w-screen w-full relative">
      {/* Gambar Slider */}
      {article.images?.length > 0 && (
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
            className="w-full h-[800px]"
          >
            {article.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full aspect-[16/9]">
                  <img
                    src={img}
                    alt={`Image ${index}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100%] h-5 bg-mainBlue blur-xl opacity-100"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Judul */}
      <h1 className="text-3xl font-bold mt-6 text-center py-4 px-4 text-secondBlue">
        {article.title}
      </h1>

      {/* Penulis & Tanggal Terbit */}
      <div className="flex justify-between text-mainGrey text-sm px-8">
        <span>Written by : {article.author}</span>
        <span>
          {new Date(article.create_date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Deskripsi Artikel */}
      <div
        className="prose prose-lg text-black text-justify pb-8 px-16 mt-4 max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content_body }}
      />

      {/* Sumber */}
      {article.sources && article.sources.length > 0 && (
        <div className="border-t border-gray-300 py-4 px-8">
          <div className="px-8 pb-4 flex gap-2 flex-wrap">
            <span className="text-md text-black">Sumber:</span>
            {article.sources.map((source, index) => (
              <span
                key={index}
                className={`text-sm font-semibold px-4 py-1 rounded-full ${
                  index % 2 === 0
                    ? "bg-mainBlue text-white"
                    : "bg-mainOrange text-white"
                }`}
              >
                <a
                  href={source.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {truncateText(source.preview_text, 50)}
                </a>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="px-8 pb-8 flex gap-2 flex-wrap">
          <span className="text-md text-black ">Tags : </span>
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className={`border text-sm font-semibold px-3 py-1 rounded-full ${
                index % 2 === 0
                  ? "border-mainBlue text-mainBlue"
                  : "border-mainOrange text-mainOrange"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
