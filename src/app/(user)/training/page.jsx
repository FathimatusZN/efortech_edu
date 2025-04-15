"use client";
import { useRouter } from "next/navigation";
import { trainingList } from "./Data";

export default function TrainingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-screen mx-auto min-h-screen px-6 pb-12">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Our Training Program
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 justify-center">
        {trainingList.map((training) => (
          <div
            key={training.id}
            className="relative group overflow-hidden rounded-lg shadow-lg w-full max-w-[400px] h-[277px] mx-auto transition-all duration-500 ease-in-out"
            onClick={() => router.push(`/training/${training.id}`)}
          >
            {/* Gambar dengan efek blur saat hover */}
            <img
              src={training.images?.[0] || "https://source.unsplash.com/400x277/?technology"}
              alt={training.title}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:blur-sm"
            />
            
            {/* Overlay untuk judul & deskripsi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white font-semibold text-lg">{training.title}</h3>
              <p className="text-white text-sm mt-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {training.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}