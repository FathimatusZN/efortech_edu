"use client";

import { useEffect, useState } from "react";
import TrainingHistoryCard from "@/components/layout/TrainingHistoryCard";

export default function TrainingHistory({ userId }) {
  const [activeTab, setActiveTab] = useState("All");
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    1: "pending",
    2: "waiting for payment",
    3: "validated",
    4: "completed",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/history/${userId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();

        const transformed = await Promise.all(
          result.data.map(async (participant) => {
            const {
              registration_participant_id,
              registration_id,
              training_name,
              training_date,
              status,
              certificate_id,
              has_review,
              email,
              user_photo,
            } = participant;

            let trainingImages = [];

            // Ambil training_id dari registration untuk ambil gambar
            try {
              const regRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/${registration_id}`
              );
              const regData = await regRes.json();
              const training_id = regData?.data?.training_id;

              if (training_id) {
                const trainingRes = await fetch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${training_id}`
                );
                const trainingDetail = await trainingRes.json();
                trainingImages = trainingDetail?.data?.images || [];
              }
            } catch (err) {
              console.warn("Failed to fetch training images:", err);
            }

            return {
              registrationParticipantId: registration_participant_id,
              registrationId: registration_id,
              trainingName: training_name,
              trainingDate: training_date,
              status: statusMap[status] || "unknown",
              hasCertificate: certificate_id !== null,
              hasReview: has_review,
              certificateId: certificate_id,
              email,
              userPhoto: user_photo,
              images: trainingImages,
              isCompleted: status === 4,
            };
          })
        );

        setTrainings(transformed.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch training history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  const filteredTrainings = () => {
    switch (activeTab) {
      case "Upcoming":
        return trainings.filter(
          (c) =>
            c.status === "pending" ||
            c.status === "waiting for payment" ||
            (c.status === "validated" && !c.isCompleted)
        );
      case "Done":
        return trainings.filter((c) => c.status === "completed" && c.isCompleted);
      default:
        return trainings;
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mt-8">History Training</h2>

      {/* TAB */}
      <div className="flex gap-4 mt-2">
        {["All", "Upcoming", "Done"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${activeTab === tab
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
        ) : filteredTrainings().length > 0 ? (
          filteredTrainings().map((training) => (
            <TrainingHistoryCard
              key={training.registrationParticipantId}
              {...training}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            There is no training in this tab.
          </p>
        )}
      </div>
    </>
  );
}
