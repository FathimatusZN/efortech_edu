"use client";

import { useState } from "react";
import HistoryCourseCard from "@/components/layout/HistoryCourseCard";
import { historyCourses } from "./Data";

export default function HistoryCourse() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCourses = historyCourses.filter((course) => {
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") {
      return (
        course.status === "waiting for payment" ||
        course.status === "pending" ||
        (course.status === "validated" && !course.isCompleted)
      );
    }
    if (activeTab === "Done") {
      return course.status === "validated" && course.isCompleted;
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
              activeTab === tab ? "text-mainOrange border-b-2 border-mainOrange" : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID COURSE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <HistoryCourseCard key={course.id} {...course} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">Tidak ada kursus di tab ini.</p>
        )}
      </div>
    </>
  );
}
