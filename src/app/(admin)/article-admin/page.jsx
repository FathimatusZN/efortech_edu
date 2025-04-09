"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ArticleCardAdmin from "@/components/admin/ArticleCardAdmin";
import { FaSearch, FaPlus } from "react-icons/fa";

const PAGE_SIZE = 6;

const ArticlePage = () => {
    const [articles, setArticles] = useState([]);
    const [displayedArticles, setDisplayedArticles] = useState([]);
    const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/articles");
                if (!response.ok) {
                    throw new Error("Failed to fetch articles");
                }
                const data = await response.json();
                console.log("Fetched articles:", data);
                setArticles(data);
                setDisplayedArticles(data.slice(0, PAGE_SIZE));
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, []);

    const loadMore = () => {
        if (loadedCount < articles.length) {
            const nextCount = Math.min(loadedCount + PAGE_SIZE, articles.length);
            setDisplayedArticles(articles.slice(0, nextCount));
            setLoadedCount(nextCount);
        }
    };

    const handleDeleteArticle = (id) => {
        setArticles(prevArticles => prevArticles.filter(article => article.article_id !== id));
        setDisplayedArticles(prevDisplayed => prevDisplayed.filter(article => article.article_id !== id));
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                {/* Title */}
                <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Articles</h1>

                    {/* Search & Add Button */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-[260px] md:w-[330px]">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[42px] pl-5 pr-10 rounded-lg border border-mainOrange shadow-sm focus:ring-1 focus:ring-mainOrange outline-none"
                            />
                            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral3" />
                        </div>

                        {/* Add New Button */}
                        <button
                            className="flex items-center gap-2 bg-lightBlue text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow hover:bg-mainBlue"
                            onClick={() => window.location.href = "/add-article"}
                        >
                            <FaPlus />
                            <span>Add New</span>
                        </button>
                    </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                    {displayedArticles.map((article) => (
                        <ArticleCardAdmin
                            key={article.article_id}
                            article_id={article.article_id}
                            title={article.title}
                            content_body={article.content_body}
                            category={article.category}
                            views={article.views || Math.floor(Math.random() * 1000)}
                            imageUrl={article.images && article.images.length > 0 ? article.images[0] : "/assets/Gambar2.jpg"}
                            onDelete={handleDeleteArticle}
                        />
                    ))}
                </div>

                {/* Load More Button */}
                {loadedCount < articles.length && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={loadMore}
                            className="bg-secondOrange text-white px-6 py-2 rounded-lg shadow hover:bg-mainOrange"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default ArticlePage;
