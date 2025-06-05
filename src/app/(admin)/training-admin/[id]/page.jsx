"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { NotFound } from "../../../../components/ui/ErrorPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";

export default function TrainingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${id}`);
        const data = await res.json();

        if (res.ok) {
          console.log("Fetched training:", data.data);
          setTraining(data.data);
        } else {
          return <NotFound
            message={"No training found."} buttons={[]}
          />
        }
      } catch (err) {
        setError("Failed to fetch training data");
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  if (loading) return <div className="p-6 md:p-8 item-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-6 md:p-8 text-red-500">{error}</div>;
  if (!training) return <NotFound message={"We couldn't find the training you're looking for."} buttons={[{ text: "Back to Training Page", href: "/training-admin" }]} />;

  const confirmDelete = () => {
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/archive/${training.training_id}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Training has been archived successfully.");
        router.push("/training-admin");
      } else {
        toast.error(data.message || "Failed to archive training.");
      }
    } catch (error) {
      toast.error("Error occurred while archiving training.");
      console.error(error);
    } finally {
      setConfirmOpen(false);
    }
  };


  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Training Detail</h1>
          <div className="flex gap-2">
            <Button
              variant="mainBlue"
              size="sm"
              className="px-4 py-1"
              onClick={() => router.push(`/training-admin/${training.training_id}/edit`)}
            >
              <FaEdit className="text-sm mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="px-4 py-1 bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              <FaTrash className="text-sm mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Hero Image + Info */}
        <div className="relative">
          <img
            src={training.images[0] || "/fallback.jpg"}
            alt={training.training_name}
            className="w-full h-72 sm:h-80 md:h-[380px] object-cover rounded-xl"
          />

          {/* Info Box */}
          <div className="absolute inset-x-0 bottom-[15] flex justify-center px-4 max-h-50">
            <div className="bg-white/50 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-4 sm:py-4 flex flex-col md:flex-row justify-between items-stretch w-full max-w-5xl gap-4 md:gap-4">
              <InfoItem
                label="Level"
                value={
                  training.level === 1
                    ? "Beginner"
                    : training.level === 2
                      ? "Intermediate"
                      : "Advanced"
                }
              />
              <VerticalDivider />
              <InfoItem label="Tanggal Pelaksanaan" value="Working Hours (by Request)" />
              <VerticalDivider />
              <InfoItem
                label="Duration"
                value={`${training.duration} ${training.duration > 1 ? "Hours" : "Hour"}`}
              />
              <VerticalDivider />
              <InfoItem
                label="Training Fees"
                value={
                  training.discount && training.discount > 0 ? (
                    <div className="flex flex-col items-center sm:items-start whitespace-nowrap">
                      <span className="line-through text-gray-500 text-xs sm:text-sm">
                        Rp {parseInt(training.training_fees).toLocaleString("id-ID")}
                      </span>
                      <span className="text-black font-bold text-sm sm:text-base">
                        Rp {parseInt(training.final_price).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ) : (
                    <span className="whitespace-nowrap text-sm sm:text-base font-bold">
                      Rp {parseInt(training.training_fees).toLocaleString("id-ID")}
                    </span>
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="mt-12 text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-mainBlue">
            {training.training_name}
          </h1>
        </div>

        {/* Content Section */}
        <div className="mt-10 space-y-6 px-4">
          <div>
            <h2 className="text-xl sm:text-2xl text-mainOrange font-bold mb-1">About</h2>
            <p className="text-black text-sm whitespace-pre-line">{training.description}</p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl text-mainOrange font-bold mb-1">Terms and Conditions</h2>
            <ul className="list-disc pl-5 text-sm text-black space-y-1">
              {training.term_condition
                ? training.term_condition
                  .split(". ")
                  .filter(Boolean)
                  .map((item, index) => (
                    <li key={index}>{item.trim().replace(/\.$/, "")}.</li>
                  ))
                : <li>No terms and condition available.</li>}
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl text-mainOrange font-bold mb-1">Certificate Validity</h2>
            <p className="text-black text-sm whitespace-pre-line mb-10">
              {training.validity_period
                ? `${training.validity_period} ${training.validity_period > 1 ? "Months" : "Month"}`
                : "No certificate validity information."}
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl text-mainOrange font-bold mb-1">Skills Earned</h2>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(training.skills) && training.skills.length > 0 ? (
                training.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-sm border rounded-lg ${index % 2 === 0 ? "border-mainOrange" : "border-mainBlue"
                      } text-black`}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills available.</p>
              )}
            </div>
          </div>

        </div>

        <ConfirmDialog
          open={confirmOpen}
          data="Training"
          id={training.training_id}
          title={training.training_name}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </ProtectedRoute>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-2 sm:px-4">
      <span className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold" style={{ textShadow: "1px 1px 0 rgba(255, 255, 255, 0.4)" }}>
        {label}
      </span>
      <span
        className="mt-1 text-sm sm:text-base md:text-lg text-black font-bold break-words text-center" style={{ textShadow: "1px 1px 0 rgba(255, 255, 255, 0.4)" }}>
        {value}
      </span>
    </div>
  );
}

function VerticalDivider() {
  return <div className="hidden md:block w-px bg-gray-300 mx-2" />;
}
