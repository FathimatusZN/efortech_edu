import React from "react";
import { FaEdit, FaTrash, FaEye, FaShapes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const categoryMap = {
    1: "Education",
    2: "Event",
    3: "Success Case",
};

function ArticleCardAdmin({ article_id, title, category, content_body, views, imageUrl, onDelete }) {
    const categoryName = categoryMap[category] || "Unknown";

    const stripHtml = (html) => {
        if (typeof window !== "undefined") {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.body.textContent || "";
        }
        return "";
    };

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return "/assets/Gambar2.jpg"; // fallback image
        if (imageUrl.startsWith("data:image")) return imageUrl; // already base64
        if (imageUrl.length > 100) return `data:image/jpeg;base64,${imageUrl}`; // assumed base64 from backend
        return imageUrl; // URL biasa
    };

    const plainContent = stripHtml(content_body);
    const truncatedContent = plainContent.length > 100
        ? plainContent.slice(0, 120) + "..."
        : plainContent;

    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/articles/${article_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete article");
            }

            // Panggil onDelete callback biar update state di page.jsx
            onDelete(article_id);
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    return (
        <div className="w-full max-w-[666px] border-2 border-mainBlue rounded-lg p-4 flex gap-4 shadow-[8px_8px_0px_0px_#157ab2] relative bg-white">
            {/* Image + Category & Views */}
            <div className="flex flex-col items-center w-{40%} h-full">
                <div className="flex-1 w-full rounded-[10px] overflow-hidden">
                    <img src={getImageSrc(imageUrl)} alt="Article" className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center justify-center w-full text-mainBlack text-[clamp(10px,1vw,14px)] mt-2 gap-4">
                    <span className="flex items-center">
                        <span className="text-mainOrange mr-2"><FaShapes /></span> {categoryName}
                    </span>
                    <span className="flex items-center">
                        <span className="text-mainOrange mr-2"><FaEye /></span> {views}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <h2 className="text-mainBlack font-montserrat font-medium text-[clamp(14px,1.8vw,28px)] leading-tight mb-2 text-justify">
                    {title}
                </h2>
                <p className="text-mainBlack font-montserrat text-[clamp(12px,1.5vw,20px)] mb-10 text-justify">
                    {truncatedContent}
                </p>
            </div>

            {/* Actions */}
            <div className="absolute bottom-4 right-4 flex gap-4">
                <button
                    onClick={() => router.push(`/article-admin/${article_id}`)}
                    className="text-white bg-mainBlue hover:bg-lightBlue px-3 py-1 rounded-lg flex items-center gap-2"
                >
                    <FaEdit />
                    <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                    onClick={handleDelete}
                    className="text-white bg-error1 hover:bg-red-700 px-3 py-1 rounded-lg flex items-center gap-2"
                >
                    <FaTrash />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </div>
        </div>
    );
};

export default ArticleCardAdmin;
