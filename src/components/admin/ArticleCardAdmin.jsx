'use client';

import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaShapes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";

const categoryMap = {
    1: "Education",
    2: "Event",
    3: "Success Case",
};

function ArticleCardAdmin({ article_id, title, category, content_body, views, imageUrl, onDelete }) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    const categoryName = categoryMap[category] || "Unknown";

    const stripHtml = (html) => {
        if (typeof window !== "undefined") {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.body.textContent || "";
        }
        return "";
    };

    const getImageSrc = (imageUrl) => {
        try {
            if (!imageUrl) throw new Error("No image URL");
            const url = new URL(imageUrl);
            return url.href;
        } catch (e) {
            return "/assets/Gambar2.jpg";
        }
    };

    const plainContent = stripHtml(content_body);
    const truncatedContent = plainContent.length > 120
        ? plainContent.slice(0, 140) + "..."
        : plainContent;

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/${article_id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete article");

            onDelete(article_id);
            setShowConfirm(false);
            toast.success("Article deleted successfully!");
        } catch (error) {
            console.error("Error deleting article:", error);
            toast.error("Failed to delete article. Please try again.");
        }
    };

    return (
        <>
            <div className="w-full max-w-4xl border-2 border-mainBlue rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow-[8px_8px_0px_0px_#157ab2] bg-white relative">
                {/* Image & Info */}
                <div className="w-full md:w-3/5 flex flex-col items-center">
                    <div className="w-full h-[200px] sm:h-[250px] md:h-[200px] rounded-[10px] overflow-hidden">
                        <img src={getImageSrc(imageUrl)} alt="Article" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-center mt-2 gap-4 text-[clamp(10px,2.5vw,14px)] text-mainBlack">
                        <span className="flex items-center gap-1">
                            <FaShapes className="text-mainOrange" /> {categoryName}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaEye className="text-mainOrange" /> {views}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow justify-between w-full">
                    <div>
                        <h2 className="text-mainBlack font-montserrat font-semibold text-[clamp(16px,2vw,20px)] leading-tight mb-2 text-justify">
                            {title}
                        </h2>
                        <p className="text-mainBlack font-montserrat text-[clamp(12px,1.5vw,16px)] text-justify">
                            {truncatedContent}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-grow flex-col justify-end items-end">
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => router.push(`/article-admin/${article_id}`)}
                                className="text-white bg-mainBlue hover:bg-lightBlue px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                            >
                                <FaEdit />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="text-white bg-error1 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                            >
                                <FaTrash />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={showConfirm}
                data="article"
                id={article_id}
                title={title}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

export default ArticleCardAdmin;
