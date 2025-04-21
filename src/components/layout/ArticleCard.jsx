"use client";
import { useRouter } from "next/navigation";

export default function ArticleCard({ id, category, title, description, image }) {
  const router = useRouter();

  return (
    <div className="bg-white w-full max-w-[417px] h-full min-h-[433px] flex flex-col border-2 border-mainBlue rounded-l-xl rounded-br-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-[200px] object-cover rounded-tl-xl"
      />

      <div className="flex flex-col flex-grow justify-between p-4">
        <div>
          {/* CATEGORY LABEL */}
          <span className="text-xs font-semibold text-mainOrange bg-neutral1 border-2 border-mainOrange px-3 py-1 rounded-full inline-block">
            {category}
          </span>

          {/* TITLE */}
          <h2 className="text-lg font-semibold mt-2 text-blue-900 leading-tight">
            {title.length > 100 ? title.substring(0, 100) + "..." : title}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-sm mt-1">
            {description.length > 100 ? description.substring(0, 100) + "..." : description}
          </p>
        </div>

        {/* READ MORE LINK */}
        <button
          onClick={() => router.push(`/article/${id}`)}
          className="text-blue-600 font-semibold mt-4 hover:underline self-start"
        >
          Read More
        </button>
      </div>
    </div>
  );
}