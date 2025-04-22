"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";

export default function TrainingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/training/id/${id}`);
        const data = await res.json();

        if (res.ok) {
          console.log("Fetched training:", data.data); // <--- ini penting
          setTraining(data.data);
        } else {
          setError("Training not found");
        }
      } catch (err) {
        setError("Failed to fetch training data");
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!training) return <div className="p-8">Training not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mt-6 mb-6">
        <h1 className="text-2xl font-bold">Training Detail</h1>
        <Button
          variant="mainBlue"
          size="sm"
          className="px-6 py-1"
          onClick={() => router.push(`/training-admin/edit/${training.id}`)}
        >
          <FaEdit className="text-sm" />
          Edit
        </Button>
      </div>

      <div className="relative">
      <img
  src={training.images[0] || "/fallback.jpg"}
  alt={training.training_name}
  className="w-full h-[380px] object-cover rounded-xl"
/>

        {/* Info Box */}
        <div className="absolute inset-x-0 -bottom-10 flex justify-center">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl px-8 py-6 flex justify-between items-stretch w-[90%] max-w-4xl">
            <InfoItem label="Level" value={training.level} />
            <VerticalDivider />
            <InfoItem label="Tanggal Pelaksanaan" value={training.date} />
            <VerticalDivider />
            <InfoItem label="Duration" value={training.duration} />
            <VerticalDivider />
            <InfoItem label="Training Fees" value={`Rp ${training.training_fees}`} />
          </div>
        </div>
      </div>

      {/* Title under Info Box */}
      <div className="mt-24 text-center">
      <h1 className="text-3xl font-bold text-mainBlue">{training.training_name}</h1>
      </div>

      {/* Content Sections */}
      <div className="mt-10 space-y-10">
        <div>
          <h2 className="text-2xl text-mainOrange font-bold mb-2">About</h2>
          <p className="text-black text-sm whitespace-pre-line">
            {training.description}
          </p>
        </div>

        <div>
          <h2 className="text-2xl text-mainOrange font-bold mb-2">Terms and Conditions</h2>
          <p className="text-black text-sm whitespace-pre-line">
            {training.terms_conditions || "No terms and condition available."}
          </p>
        </div>

        <div>
          <h2 className="text-2xl text-mainOrange font-bold mb-2">Skills Earned</h2>
          <p className="text-black text-sm whitespace-pre-line">
  {Array.isArray(training.skills) && training.skills.length > 0
    ? training.skills.join(", ")
    : "No skills available."}
</p>

        </div>

        <div>
          <h2 className="text-2xl text-mainOrange font-bold mb-2">Masa berlaku sertifikat</h2>
          <p className="text-black text-sm whitespace-pre-line mb-10">
            {training.validity_period || "No certificate validity information."}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 text-center">
      <span className="text-sm text-gray-700 font-semibold">{label}</span>
      <span className="text-base text-black font-bold mt-1">{value}</span>
    </div>
  );
}

function VerticalDivider() {
  return <div className="w-px bg-gray-300 mx-2" />;
}
