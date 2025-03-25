"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ArticleCard from "@/components/admin/ArticleCardAdmin";
import { FaSearch, FaPlus } from "react-icons/fa";
import { articles } from "./data"; // Import data dari file data.js

const PAGE_SIZE = 6;

const ArticlePage = () => {
    const [displayedArticles, setDisplayedArticles] = useState(articles.slice(0, PAGE_SIZE));
    const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);

    const loadMore = () => {
        const nextCount = loadedCount + PAGE_SIZE;
        setDisplayedArticles(articles.slice(0, nextCount));
        setLoadedCount(nextCount);
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
                                className="w-full h-[42px] pl-5 pr-10 rounded-lg border border-mainOrange shadow-sm focus:ring-1 focus:ring-mainOrange outline-none"
                            />
                            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral3" />
                        </div>

                        {/* Add New Button */}
                        <button className="flex items-center gap-2 bg-lightBlue text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow hover:bg-mainBlue" href="../add-article">
                            <FaPlus />
                            <span>Add New</span>
                        </button>
                    </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                    {displayedArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            title={article.title}
                            description={article.description}
                            category={article.category}
                            views={100} // Data views belum ada di dummy, bisa diganti dengan random
                            imageUrl={article.image}
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
