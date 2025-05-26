"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ArticleCardAdmin from "@/components/admin/ArticleCardAdmin";
import { NotFound } from "@/components/ui/ErrorPage";
import { FaSearch, FaPlus } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const PAGE_SIZE = 6;

const ArticleAdminPage = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = PAGE_SIZE; // 6 articles per page
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllArticles();

    const handleRefresh = () => {
      fetchAllArticles();
    };

    window.addEventListener("refreshArticles", handleRefresh);

    return () => {
      window.removeEventListener("refreshArticles", handleRefresh);
    };
  }, []);

  const fetchAllArticles = async () => {
    setIsLoading(true); // mulai loading
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles`
      );
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    setIsLoading(true);
    if (!searchQuery.trim()) {
      fetchAllArticles();
      return;
    }
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/articles/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setArticles(Array.isArray(data.data) ? data.data : []);
      setPage(1);
    } catch (error) {
      console.error("Error searching articles:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchSearchResults();
    }
  };

  const handleDeleteArticle = (deletedId) => {
    setArticles((prev) =>
      prev.filter((article) => article.article_id !== deletedId)
    );
    dispatchEvent(new Event("refreshArticles"));
  };

  const selectedCategoryId = categoryOptions.find(
    (cat) => cat.label === selectedCategory
  )?.id;

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((article) => {
        return (
          selectedCategory === "All" || article.category === selectedCategoryId
        );
      })
    : [];

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
        {/* Title & Actions */}
        <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Articles</h1>

          {/* Search & Add Button */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex w-full sm:w-[280px]">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-[42px] pl-5 pr-10 border-2 rounded-l-lg border-mainOrange shadow-sm focus:ring-0 focus:outline-none"
              />
              <button
                onClick={fetchSearchResults}
                className="px-4 bg-mainOrange text-white rounded-r-lg hover:bg-secondOrange"
              >
                <FaSearch />
              </button>
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-[42px] rounded-lg border-mainOrange focus:ring-0 focus:outline-none">
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

            {/* Add Button */}
            <button
              className="flex items-center gap-2 bg-lightBlue text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow hover:bg-mainBlue"
              onClick={() => (window.location.href = "/add-article")}
            >
              <FaPlus />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Articles Grid & Pagination */}
        <div>
          {isLoading ? (
            // Loading spinner hanya di sini
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {paginatedArticles.map((article) => (
                  <ArticleCardAdmin
                    key={article.article_id}
                    article_id={article.article_id}
                    title={article.title}
                    content_body={article.content_body}
                    category={article.category}
                    views={article.views || 0}
                    imageUrl={article.images?.[0] || "/assets/Gambar2.jpg"}
                    onDelete={handleDeleteArticle}
                  />
                ))}
              </div>

              {paginatedArticles.length === 0 && (
                <NotFound
                  message="We couldn’t find any articles matching your search or category. Try different keywords."
                  buttons={[]}
                />
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <Pagination>
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((prev) => Math.max(prev - 1, 1));
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
                            setPage((prev) => Math.min(prev + 1, totalPages));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <p className="text-sm text-muted-foreground flex justify-center items-center mt-2">
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
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ArticleAdminPage;
