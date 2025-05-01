"use client";

import { useEffect, useState } from "react";
import HistoryCourseCard from "@/components/layout/HistoryCourseCard";

export default function HistoryCourse({ userId }) {
  const [activeTab, setActiveTab] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    1: "waiting for payment",
    2: "pending",
    3: "validated",
    4: "completed",
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/history/${userId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();

        const promises = result.data.map(async (training) => {
          // Fetch detail registration untuk ambil training_id
          const regRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/${training.registration_id}`
          );
          const regResult = await regRes.json();
          const trainingId = regResult.data.training_id;

          // Fetch detail training untuk ambil gambar
          const trainingRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${trainingId}`
          );
          const trainingDetail = await trainingRes.json();
          const imageUrls = trainingDetail.data?.images || [];

          const statusStr = statusMap[training.status] || "unknown";
  
          const hasCertificate = training.certificate_id !== null;

          return {
            id: training.registration_id,
            trainingId,
            title: training.training_name,
            images: imageUrls,
            status: statusStr,
            hasReview: training.has_review,
            hasCertificate,
            trainingDate: training.training_date,
            certificateId: training.certificate_id,
            userPhoto: training.user_photo,
            email: training.email,
          };
        });

        const transformed = await Promise.all(promises);
        setCourses(transformed);
      } catch (err) {
        console.error("Failed to fetch course history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCourseData();
    }
  }, [userId]);

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") {
      return (
        course.status === "waiting for payment" ||
        course.status === "pending" ||
        (course.status === "validated" && !course.isCompleted)
      );
    }
    if (activeTab === "Done") {
      return course.status === "completed" && course.isCompleted;
    }
    return false;
  });

  return (
    <>
      <h2 className="text-xl font-bold mt-8">History Course</h2>

      {/* TAB */}
      <div className="flex gap-4 mt-2">
        {["All", "Upcoming", "Done"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "text-mainOrange border-b-2 border-mainOrange"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <p className="col-span-full text-center py-10 text-gray-500">
            Loading...
          </p>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <HistoryCourseCard key={course.id} {...course} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            Tidak ada kursus di tab ini.
          </p>
        )}
      </div>
    </>
  );
}
