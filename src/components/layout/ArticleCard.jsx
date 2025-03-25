// components/ArticleCard.jsx
"use client";
import { useRouter } from "next/navigation";
export default function ArticleCard({ id, category, title, description, image, link }) {
  const router = useRouter();
    return (
      <div className="bg-white max-w-[417] max-h-[433] border-2 border-mainBlue rounded-l-xl rounded-br-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
        {/* IMAGE */}
        <img src={image} alt={title} className="w-full h-[241] object-cover rounded-tl-xl" />
  
        {/* CATEGORY LABEL */}
        <span className="text-xs font-semibold text-mainOrange bg-neutral1 border-2 border-mainOrange px-3 mx-3 py-1 rounded-full inline-block mt-3">
          {category}
        </span>
  
        {/* TITLE */}
        <h2 className="text-lg font-semibold mt-2 text-blue-900 mx-4 leading-tight">
          {title.length > 100 ? title.substring(0, 100) + "..." : title}
        </h2>
  
        {/* DESCRIPTION */}
        <p className="text-gray-600 mx-4 text-sm mt-1">{description.substring(0, 50)}...</p>
  
        {/* READ MORE LINK */}
        <button
        onClick={() => router.push(`/article/${id}`)}
        className="text-blue-600 mx-4 font-semibold my-3 inline-block hover:underline"
      >
        Read More
      </button>
      </div>
    );
  }
  