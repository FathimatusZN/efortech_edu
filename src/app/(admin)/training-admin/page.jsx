"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

export default function TrainingPage() {
  const router = useRouter();
  const trainingData = [
    {
      id: 1,
      title: "WISE-4000 LAN Wireless / IO Module Series",
      image: "assets/gambar1.jpg",
      description: "Explore the latest wireless IO module series for industrial automation.",
      price: "Gratis",
      status: "Aktif",
    },
    {
      id: 2,
      title: "Mastering EdgeLink: IoT Gateway for Seamless OT-IT Integration",
      image: "assets/Gambar2.jpg",
      description: "Learn how to integrate IoT gateways with seamless OT-IT connectivity.",
      price: "Rp300.000",
      status: "Aktif",
    },
    {
      id: 3,
      title: "Accelerating Digital O&M using DeviceOn/BI and Patrol Inspection",
      image: "https://source.unsplash.com/400x300/?circuit",
      description: "Enhance your operations with AI-powered digital maintenance.",
      price: "Rp250.000",
      status: "Aktif",
    },
    {
      id: 4,
      title: "Familiarize yourself with all functions in Advantech IoT Academy",
      image: "https://source.unsplash.com/400x300/?engineering",
      description: "A complete training program to understand IoT functions.",
      price: "Rp450.000",
      status: "Aktif",
    },
    {
      id: 5,
      title: "Industrial IoT Training and International Advantech",
      image: "https://source.unsplash.com/400x300/?industry",
      description: "Join our industrial IoT training for a better understanding of automation.",
      price: "Rp500.000",
      status: "Aktif",
    },
    {
      id: 6,
      title: "Scaling Digitalization with Edge-as-a-Service",
      image: "https://source.unsplash.com/400x300/?digital",
      description: "Discover how edge computing can optimize digital transformation.",
      price: "Rp350.000",
      status: "Aktif",
    },
  ];

  return (
      <div className="flex flex-col justify-center w-full max-w-screen mx-auto min-h-screen px-6 pb-12">
        <div className="flex items-center justify-between mt-6 mb-6">
          <h2 className="text-2xl font-bold">Training & Courses</h2>
          <button
            onClick={() => router.push("/training-admin/add")}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
          >
            + Add New
          </button>
        </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {trainingData.map((training) => (
            <div
              key={training.id}
              onClick={() => router.push(`/training-admin/${training.id}`)}
              className="border border-gray-200 shadow-lg rounded-2xl overflow-hidden flex flex-col cursor-pointer w-full h-[430px] max-w-sm"
            >
              <div className="h-[200px] w-full">
                <img
                  src={training.image}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/2 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                    {training.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {training.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <div>
                    <p className="text-green-600 font-medium">{training.status}</p>
                    <p className="text-gray-700 font-semibold">{training.price}</p>
                  </div>
                  <ArrowRight className="text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
