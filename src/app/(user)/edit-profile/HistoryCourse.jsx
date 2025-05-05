"use client";

import { useEffect, useState } from "react";
import HistoryCourseCard from "@/components/layout/HistoryCourseCard";

export default function HistoryCourse({ userId }) {
  const [activeTab, setActiveTab] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    1: "pending",
    2: "waiting for payment",
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

        console.log("Course history result:", result);

        const promises = result.data.map(async (training) => {
          const participantId = training.registration_participant_id;
          // Fetch detail registration untuk ambil training_id
          const regRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/${training.registration_id}`
          );
          const regResult = await regRes.json();
          if (!regResult?.data?.training_id) {
            console.warn(
              "training_id not found in registration data:",
              regResult
            );
            return null; // atau skip this item
          }
          const trainingId = regResult.data.training_id;

          // Fetch detail training untuk ambil gambar
          const trainingRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${trainingId}`
          );
          const trainingDetail = await trainingRes.json();
          const imageUrls = trainingDetail.data?.images || [];

          const statusStr = statusMap[training.status] || "unknown";
          const isCompleted = training.status === 4;

          const hasCertificate = training.certificate_id !== null;

          return {
            id: training.registration_id,
            trainingId,
            participantId,
            title: training.training_name,
            images: imageUrls,
            status: statusStr,
            hasReview: training.has_review,
            hasCertificate,
            trainingDate: training.training_date,
            certificateId: training.certificate_id,
            userPhoto: training.user_photo,
            email: training.email,
            isCompleted,
          };
        });

        const transformed = (await Promise.all(promises)).filter(Boolean);
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

  const filteredCourses = () => {
    switch (activeTab) {
      case "Upcoming":
        return courses.filter(
          (c) =>
            c.status === "waiting for payment" ||
            c.status === "pending" ||
            (c.status === "validated" && !c.isCompleted)
        );
      case "Done":
        return courses.filter((c) => c.status === "completed" && c.isCompleted);
      default:
        return courses;
    }
  };

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
        ) : filteredCourses().length > 0 ? (
          filteredCourses().map((course) => (
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
