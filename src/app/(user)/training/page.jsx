"use client";
import { useRouter } from "next/navigation";

export default function TrainingPage() {
  const router = useRouter();
  const trainingData = [
    {
      title: "WISE-4000 LAN Wireless / IO Module Series",
      image: "https://source.unsplash.com/400x277/?technology",
      description: "Explore the latest wireless IO module series for industrial automation.",
    },
    {
      title: "Mastering EdgeLink: IoT Gateway for Seamless OT-IT Integration",
      image: "https://source.unsplash.com/400x277/?server",
      description: "Learn how to integrate IoT gateways with seamless OT-IT connectivity.",
    },
    {
      title: "Accelerating Digital O&M using DeviceOn/BI and Patrol Inspection",
      image: "https://source.unsplash.com/400x277/?circuit",
      description: "Enhance your operations with AI-powered digital maintenance.",
    },
    {
      title: "Familiarize yourself with all functions in Advantech IoT Academy",
      image: "https://source.unsplash.com/400x277/?engineering",
      description: "A complete training program to understand IoT functions.",
    },
    {
      title: "Industrial IoT Training and International Advantech",
      image: "https://source.unsplash.com/400x277/?industry",
      description: "Join our industrial IoT training for a better understanding of automation.",
    },
    {
      title: "Scaling Digitalization with Edge-as-a-Service",
      image: "https://source.unsplash.com/400x277/?digital",
      description: "Discover how edge computing can optimize digital transformation.",
    },
    {
      title: "Familiarize yourself with all functions in Advantech IoT Academy",
      image: "https://source.unsplash.com/400x277/?engineering",
      description: "A complete training program to understand IoT functions.",
    },
    {
      title: "Industrial IoT Training and International Advantech",
      image: "https://unsplash.com/photos/black-metal-empty-building-SLIFI67jv5k",
      description: "Join our industrial IoT training for a better understanding of automation.",
    },
    {
      title: "Scaling Digitalization with Edge-as-a-Service",
      image: "https://source.unsplash.com/400x277/?digital",
      description: "Discover how edge computing can optimize digital transformation.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-screen mx-auto min-h-screen px-6 pb-12">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Our Training Program
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 justify-center">
        {trainingData.map((training, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg w-full max-w-[400px] h-[277px] mx-auto transition-all duration-500 ease-in-out"
            onClick={() => router.push(`/training/${training.id}`)}
          >
            {/* Gambar dengan efek blur saat hover */}
            <img
              src={training.image}
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
