// efortech_edu\src\app\(user)\article\page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
];

export default function ArticlePage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [mostViewedArticles, setMostViewedArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    articlesPerPage: 12,
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch most viewed articles for carousel
  useEffect(() => {
    fetchMostViewedArticles();
  }, []);

  // Fetch articles when filters change
  useEffect(() => {
    fetchArticles();
  }, [page, selectedCategory]);

  // Auto-slide carousel
  useEffect(() => {
    if (mostViewedArticles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mostViewedArticles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mostViewedArticles]);

  const fetchMostViewedArticles = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/most-viewed?limit=3`
      );
      const data = await res.json();
      if (res.ok && data.data) {
        setMostViewedArticles(data.data);
      }
    } catch (error) {
      console.error("Error fetching most viewed articles:", error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const categoryId = categoryOptions.find(
        (cat) => cat.label === selectedCategory
      )?.id;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort_by: "create_date",
        sort_order: "desc",
      });

      if (categoryId && categoryId !== 0) {
        params.append("category", categoryId.toString());
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles?${params}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setArticles(data.data?.articles || []);
      setPagination(data.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalArticles: 0,
        articlesPerPage: 12,
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalArticles: 0,
        articlesPerPage: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page
    fetchArticles();
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1); // Reset to first page
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const plain = html.replace(/<[^>]*>/g, "").trim();
    return plain.length > 200 ? plain.slice(0, 200) + "..." : plain;
  };

  return (
    <div className="max-w-screen w-full relative mx-auto">
      {/* Carousel Section */}
      <div className="relative w-full aspect-[21/9] max-h-[55vh] overflow-hidden shadow-lg">
        {mostViewedArticles.length > 0 && (
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() =>
              router.push(
                `/article/${mostViewedArticles[currentSlide].article_id}`
              )
            }
          >
            <img
              src={
                mostViewedArticles[currentSlide].images?.[0] ||
                "/assets/Gambar2.jpg"
              }
              alt={mostViewedArticles[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end text-white text-center p-6">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
                {mostViewedArticles[currentSlide].title}
              </h1>
            </div>
          </div>
        )}

        {/* Carousel Indicators */}
        <div className="absolute bottom-[5px] left-0 right-0 flex justify-center space-x-2 z-10">
          {mostViewedArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${currentSlide === index
                ? "border-mainOrange"
                : "border-gray-400"
                }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${currentSlide === index ? "bg-mainOrange" : "bg-transparent"
                  }`}
              ></div>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="mt-6 mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full h-[38px] px-4 pr-10 border-2 border-mainOrange rounded-md"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-mainOrange"
          >
            <FaSearch />
          </button>
        </div>

        <div className="w-full md:w-1/6">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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

      {/* Articles Grid */}
      <div className="p-10 mx-auto max-w-7xl w-full">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => {
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
                ? "We couldn't find any article matching your search. Try different keywords."
                : "No articles found in this category."
            }
            buttons={[]}
          />
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
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
            {(() => {
              const maxVisible = 5;
              let startPage = Math.max(
                1,
                Math.min(
                  page - Math.floor(maxVisible / 2),
                  pagination.totalPages - maxVisible + 1
                )
              );
              let endPage = Math.min(
                pagination.totalPages,
                startPage + maxVisible - 1
              );

              return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => {
                  const pageNum = startPage + i;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              );
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pagination.totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Result Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground mt-2 flex justify-center items-center pb-10">
          Showing{" "}
          {pagination.totalArticles > 0
            ? `${(page - 1) * pagination.articlesPerPage + 1} - ${Math.min(
              page * pagination.articlesPerPage,
              pagination.totalArticles
            )}`
            : 0}{" "}
          of {pagination.totalArticles} article
          {pagination.totalArticles !== 1 && "s"}
        </p>
      )}
    </div>
  );
}