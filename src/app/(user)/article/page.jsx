"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaSearch } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ArticleCard from "@/components/layout/ArticleCard";
import { NotFound } from "@/components/ui/ErrorPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const categoryOptions = [
  { id: 0, label: "All" },
  { id: 1, label: "Education" },
  { id: 2, label: "Event" },
  { id: 3, label: "Success Story" },
  { id: 4, label: "Blog" },
];

export default function ArticlePage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [mostViewedArticles, setMostViewedArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setArticles(data.data);
      const sorted = [...data.data].sort((a, b) => b.views - a.views);
      setMostViewedArticles(sorted.slice(0, 3));
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) {
      fetchArticles();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/articles/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setArticles(data.data);
      setPage(1);
    } catch (error) {
      console.error("Search error:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const plain = html.replace(/<[^>]*>/g, "").trim();
    return plain.length > 200 ? plain.slice(0, 200) + "..." : plain;
  };

  const selectedCategoryId = categoryOptions.find(
    (cat) => cat.label === selectedCategory
  )?.id;

  const filteredArticles = articles.filter((article) => {
    return (
      selectedCategory === "All" || article.category === selectedCategoryId
    );
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="max-w-screen w-full relative mx-auto">
      {/* Carousel */}
      <Swiper
        modules={[SwiperPagination, Autoplay]}
        pagination={{ el: ".custom-pagination", clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="w-full h-[500px] aspect-[4/3] md:aspect-[16/9] overflow-hidden shadow-lg"
      >
        {mostViewedArticles.map((article) => (
          <SwiperSlide
            key={article.article_id}
            className="relative cursor-pointer"
            onClick={() => router.push(`/article/${article.article_id}`)}
          >
            <img
              src={article.images?.[0] || "/assets/Gambar2.jpg"}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end text-white text-center p-6">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
                {article.title}
              </h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination flex justify-center mt-4"></div>

      {/* Search + Filter */}
      <div className="mt-6 mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchSearchResults();
            }}
            className="w-full h-[38px] px-4 pr-10 border-2 border-mainOrange rounded-md"
          />
          <button
            onClick={fetchSearchResults}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-mainOrange"
          >
            <FaSearch />
          </button>
        </div>

        <div className="w-full md:w-1/6">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-[38px] rounded-md shadow-lg border-orange-500 focus:ring-orange-600">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.id} value={cat.label}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Article Cards or Spinner */}
      <div className="p-10 mx-auto max-w-7xl w-full">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedArticles.map((article) => {
              const categoryObj = categoryOptions.find(
                (cat) => cat.id === article.category
              );
              return (
                <ArticleCard
                  key={article.article_id}
                  id={article.article_id}
                  category={categoryObj?.label || "Unknown"}
                  title={article.title}
                  description={stripHtml(article.content_body)}
                  image={article.images?.[0] || "/assets/Gambar2.jpg"}
                />
              );
            })}
          </div>
        ) : (
          <NotFound
            message={
              searchQuery
                ? "We couldn’t find any article matching your search. Try different keywords."
                : "No articles found in this category."
            }
            buttons={[]}
          />
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination className="flex justify-center mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Showing info */}
      {!loading && (
        <p className="text-sm text-muted-foreground mt-2 flex justify-center items-center">
          Showing{" "}
          {filteredArticles.length > 0
            ? `${(page - 1) * itemsPerPage + 1} - ${Math.min(
              page * itemsPerPage,
              filteredArticles.length
            )}`
            : 0}{" "}
          of {filteredArticles.length} article
          {filteredArticles.length !== 1 && "s"}
        </p>
      )}
    </div>
  );
}
