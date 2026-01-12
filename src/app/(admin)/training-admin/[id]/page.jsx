// efortech_edu\src\app\(admin)\training-admin\[id]\page.jsx
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

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-UK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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
  const [trainingStats, setTrainingStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${id}`);
        const data = await res.json();

        if (res.ok) {
          setTraining(data.data);

          // Fetch creator name if created_by exists
          if (data.data.created_by) {
            try {
              const adminRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manageadmin/${data.data.created_by}`);
              if (adminRes.ok) {
                const adminData = await adminRes.json();
                setCreatorName(adminData.data?.fullname || data.data.created_by);
              }
            } catch (err) {
              console.log("Failed to fetch admin name:", err);
              setCreatorName(data.data.created_by);
            }
          }
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

  // Fetch detailed statistics for the training
  useEffect(() => {
    const fetchTrainingStats = async () => {
      if (!training) return;

      setLoadingStats(true);
      try {
        // Fetch registrations for this training
        const regRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/search?training_name=${encodeURIComponent(training.training_name)}`
        );

        if (regRes.ok) {
          const regData = await regRes.json();
          const registrations = regData.data || [];

          // Calculate stats
          const totalRegistrations = registrations.length;
          const totalParticipants = registrations.reduce((sum, reg) => {
            return sum + (reg.participants ? reg.participants.length : 0);
          }, 0);

          // Count completed registrations (status = 4)
          const completedRegistrations = registrations.filter(reg => reg.status === 4).length;

          // Fetch participants who completed and have certificates
          const participantsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/participants?group_by_training=false&keyword=${encodeURIComponent(training.training_name)}`
          );

          let completedParticipants = 0;
          let totalReviews = 0;
          let avgRating = 0;

          if (participantsRes.ok) {
            const participantsData = await participantsRes.json();
            const participants = participantsData.data || [];

            // Filter participants for this specific training and count those with certificates
            const trainingParticipants = participants.filter(p => p.training_name === training.training_name);
            completedParticipants = trainingParticipants.filter(p => p.has_certificate === true).length;
            totalReviews = trainingParticipants.filter(p => p.has_review === true).length;
          }

          setTrainingStats({
            totalRegistrations,
            totalParticipants,
            completedRegistrations,
            completedParticipants,
            totalReviews,
            avgRating: training.rating || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch training stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchTrainingStats();
  }, [training]);

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

  const handleLoadReviews = async () => {
    if (showReviews) {
      setShowReviews(false);
      return;
    }

    setLoadingReviews(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/search?training_name=${encodeURIComponent(training.training_name)}&sort_by=review_date&sort_order=desc`
      );

      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
        setShowReviews(true);
      } else {
        toast.error("Failed to load reviews");
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Error loading reviews");
    } finally {
      setLoadingReviews(false);
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

        {/* Status Badge */}
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <span className={`px-4 py-2 rounded-lg font-semibold text-sm border ${training.status === 1
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-gray-50 text-gray-700 border-gray-300"
            }`}>
            {training.status === 1 ? "✓ Active" : "⊗ Archived"}
          </span>

          {training.discount > 0 && (
            <span className="px-4 py-2 rounded-lg font-semibold text-sm bg-red-50 text-red-700 border border-red-300">
              🔥 {training.discount}% Discount Active
            </span>
          )}

          {training.created_by && (
            <span className="px-4 py-2 rounded-lg text-sm bg-gray-50 text-gray-700 border border-gray-300">
              Created by{" "}
              <span className="font-semibold">
                {creatorName || training.created_by}
              </span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-gray-600">
                {formatDate(training.created_date)}
              </span>
            </span>
          )}
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

          {/* Training Statistics Section */}
          <div className="border-t pt-6 mt-8">
            <h2 className="text-xl sm:text-2xl text-mainOrange font-bold mb-4">Training Statistics</h2>

            {loadingStats ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : trainingStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Registrations</p>
                        <p className="text-2xl font-bold text-gray-900">{trainingStats.totalRegistrations}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">All registration records</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Total Participants</p>
                        <p className="text-2xl font-bold text-gray-900">{trainingStats.totalParticipants}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Enrolled in this training</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Completed Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">{trainingStats.completedRegistrations}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Training sessions (registration) finished</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Certified Graduates</p>
                        <p className="text-2xl font-bold text-gray-900">{trainingStats.completedParticipants}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">With certificates issued</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Reviews Submitted</p>
                        <p className="text-2xl font-bold text-gray-900">{trainingStats.totalReviews}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Participant feedback count</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-900"> {trainingStats.avgRating.toFixed(1)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">From all reviews</p>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleLoadReviews}
                    disabled={loadingReviews}
                    className="w-full sm:w-auto"
                  >
                    {loadingReviews ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading Reviews...
                      </>
                    ) : showReviews ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide Reviews
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Load Reviews ({trainingStats.totalReviews})
                      </>
                    )}
                  </Button>

                  {showReviews && (
                    <div className="mt-4 overflow-x-auto">
                      {reviews.length > 0 ? (
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">User</th>
                              <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                              <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Rating</th>
                              <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Review</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews.map((review, index) => (
                              <tr key={review.review_id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    {review.user_photo ? (
                                      <img src={review.user_photo} alt={review.fullname} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-600 font-medium">
                                          {review.fullname?.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-900">{review.fullname}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-gray-600">
                                  {new Date(review.review_date).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-sm font-semibold text-gray-900">{review.score}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-gray-700 max-w-md">
                                  <p className="line-clamp-2">{review.review_description}</p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No reviews yet for this training.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No statistics available yet.</p>
            )}
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