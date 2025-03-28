"use client";
import { useRouter } from "next/navigation";

export default function HistoryCourseCard({ id, image, title, date, time, mode }) {
  const router = useRouter();

  return (
    <div className="bg-white w-full max-w-[5000px] max-h-[433px] border-2 border-mainBlue rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* IMAGE */}
      <div className="relative w-full max-w-[500px] p-4">
        <img src={image} alt={title} className="w-full h-[200px] rounded-xl object-cover" />
      </div>

      {/* COURSE INFO */}
      <div className="p-4 text-center">
        <div className="flex justify-center gap-2 text-sm font-light text-mainOrange">
          <span className="border-2 border-mainOrange px-2 py-1 rounded-xl bg-neutral1">{mode}</span>
          <span className="border-2 border-mainOrange px-2 py-1 rounded-xl bg-neutral1">{date}</span>
          <span className="border-2 border-mainOrange px-2 py-1 rounded-xl bg-neutral1">{time}</span>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-blue-900 mt-3">{title}</h2>

        {/* BUTTON */}
        <button
          onClick={() => router.push(`/course/${id}`)}
          className="bg-mainOrange text-white font-semibold px-6 py-2 mt-4 rounded-lg hover:bg-orange-600 transition-all"
        >
          See Details
        </button>
      </div>
    </div>
  );
}