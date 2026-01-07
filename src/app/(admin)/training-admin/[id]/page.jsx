"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { NotFound } from "../../../../components/ui/ErrorPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArchiveDialog, DeleteTrainingDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";

export default function TrainingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [relationStatus, setRelationStatus] = useState(null);
  const [deleteSummary, setDeleteSummary] = useState(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${id}`);
        const data = await res.json();

        if (res.ok) {
          setTraining(data.data);
        } else {
          setError("No training found.");
        }
      } catch (err) {
        setError("Failed to fetch training data");
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  if (loading)
    return <div className="p-6 md:p-8 item-center"><LoadingSpinner /></div>;

  if (error)
    return (
      <div className="p-6 md:p-8 text-red-500">
        {error.includes("No training found") ? (
          <NotFound
            message={"We couldn't find the training you're looking for."}
            buttons={[{ text: "Back to Training Page", href: "/training-admin" }]}
          />
        ) : (
          error
        )}
      </div>
    );

  if (!training)
    return <NotFound message={"We couldn't find the training you're looking for."} buttons={[{ text: "Back to Training Page", href: "/training-admin" }]} />;

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

  const handleCheckDeleteRelations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/check-relations/${training.training_id}`);
      const data = await res.json();

      if (res.ok) {
        setRelationStatus(data.data.relation_status);
        setDeleteMessage(data.data.message);
        setDeleteSummary(data.data.summary);
        setDeleteConfirmOpen(true);
      } else {
        toast.error(data.message || "Failed to check training relations.");
      }
    } catch (err) {
      toast.error("Error checking training relations.");
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/delete-with-relations/${training.training_id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Training deleted successfully.");
        router.push("/training-admin");
      } else {
        toast.error(data.message || "Failed to delete training.");
      }
    } catch (error) {
      toast.error("Error occurred while deleting training.");
      console.error(error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Training Detail</h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
              variant="orange"
              size="sm"
              className="px-4 py-1"
              onClick={confirmDelete} >
              <FaArchive className="text-sm mr-2" />
              Archive
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="px-4 py-1 bg-red-600 hover:bg-red-700"
              onClick={handleCheckDeleteRelations}
            >
              <FaTrash className="text-sm mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <img
            src={training.images[0] || "/fallback.jpg"}
            alt={training.training_name}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Info bar (desktop only) */}
          <div className="hidden md:flex absolute inset-x-0 bottom-4 justify-center px-4">
            <InfoBar training={training} />
          </div>
        </div>

        {/* Info bar (mobile) */}
        <div className="mt-4 md:hidden px-4">
          <InfoBar training={training} />
        </div>

        <div className="mt-6 text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-mainBlue">
            {training.training_name}
          </h1>
        </div>

        <div className="mt-6 space-y-6 px-4">
          <div>
            <h2 className="text-xl sm:text-2xl text-mainOrange font-bold mb-1">Description</h2>
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

        <ArchiveDialog
          open={confirmOpen}
          data="Training"
          id={training.training_id}
          title={training.training_name}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        <DeleteTrainingDialog
          open={deleteConfirmOpen}
          onCancel={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          relationStatus={relationStatus}
          message={deleteMessage}
          data="Training"
          id={training.training_id}
          title={training.training_name}
          summary={deleteSummary}
        />
      </div>
    </ProtectedRoute>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
        {label}
      </span>
      <span className="mt-1 text-sm sm:text-base font-bold text-gray-900">
        {value}
      </span>
    </div>
  );
}

function VerticalDivider() {
  return (
    <div className="hidden md:block self-stretch w-px bg-white mx-4" />
  );
}

function InfoBar({ training }) {
  return (
    <div
      className="
        /* MOBILE */
        bg-gradient-to-br from-white via-sky-50 to-white
        border border-sky-100
        shadow-md
        grid grid-cols-2 gap-4
        px-4 py-4

        /* DESKTOP OVERRIDE */
        md:bg-none
        md:bg-white/50
        md:backdrop-blur-md
        md:border-white/30
        md:shadow-lg
        md:flex md:flex-row md:justify-between md:items-center
        md:px-5 md:py-4

        rounded-2xl
        w-full max-w-5xl
      "
    >
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

      <InfoItem label="Available Date" value={training.available_date} />

      <VerticalDivider />

      <InfoItem
        label="Duration"
        value={`${training.duration} ${training.duration > 1 ? "Hours" : "Hour"
          }`}
      />

      <VerticalDivider />

      <InfoItem
        label="Training Fees"
        value={
          training.discount && training.discount > 0 ? (
            <div className="flex flex-col items-center md:items-start whitespace-nowrap">
              <span className="line-through text-gray-500 text-xs">
                Rp {parseInt(training.training_fees).toLocaleString("id-ID")}
              </span>
              <span className="text-black font-bold">
                Rp {parseInt(training.final_price).toLocaleString("id-ID")}
              </span>
            </div>
          ) : (
            <span className="whitespace-nowrap font-bold">
              Rp {parseInt(training.training_fees).toLocaleString("id-ID")}
            </span>
          )
        }
      />
    </div>
  );
}
