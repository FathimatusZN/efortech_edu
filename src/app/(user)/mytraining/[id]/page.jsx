// efortech_edu\src\app\(user)\mytraining\[id]\page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NotFound } from "@/components/ui/ErrorPage";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Download,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Upload,
    MessageSquare,
    Award,
    Mail,
    Star,
} from "lucide-react";
import DocumentPreviewDialog from "@/components/layout/DocumentPreviewDialog";
import UploadPaymentDialog from "@/components/layout/UploadPaymentDialog";
import UploadCertificateDialog from "@/components/layout/UploadCertificateDialog";
import ReviewDialog from "@/components/layout/ReviewDialog";

export default function MyTrainingDetailPage() {
    const { id } = useParams(); // registration_participant_id
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trainingData, setTrainingData] = useState(null);
    const [registrationData, setRegistrationData] = useState(null);
    const [certificateData, setCertificateData] = useState(null);

    // Dialog states
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showAdvantechDialog, setShowAdvantechDialog] = useState(false);
    const [showDocPreview, setShowDocPreview] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);

    // Fetch data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push(`/auth/signin?redirect=/mytraining/${id}`);
                return;
            }
            setUser(currentUser);
            await fetchTrainingData(currentUser.uid);
        });

        return () => unsubscribe();
    }, [id]);

    const fetchTrainingData = async (userId) => {
        try {
            setLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/history/${userId}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch history");
            }

            const result = await res.json();

            if (!result?.data) {
                console.warn("No history data");
                setTrainingData(null);
                return;
            }

            const participant = result.data.find(
                (p) => p.registration_participant_id === id
            );

            // 🚨 NOT FOUND IS NOT ERROR
            if (!participant) {
                console.warn("Participant not found:", id);
                setTrainingData(null);
                setRegistrationData(null);
                return;
            }

            setTrainingData(participant);

            // Registration
            const regRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/${participant.registration_id}`
            );
            const regData = await regRes.json();
            if (regRes.ok && regData.data) setRegistrationData(regData.data);

            // Certificate
            if (participant.has_certificate && participant.certificate_id) {
                const certRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/${participant.certificate_id}`
                );
                const certData = await certRes.json();
                if (certRes.ok && certData.data) setCertificateData(certData.data);
            }
        } catch (err) {
            console.error("🔥 Fetch training error:", err);
            setTrainingData(null);
            setRegistrationData(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        if (user) {
            fetchTrainingData(user.uid);
        }
    };

    // Status mapping with revised logic
    const getStatusInfo = () => {
        if (!trainingData || !registrationData) return null;

        const status = registrationData.status;
        const attendanceStatus = trainingData.attendance_status;
        const hasReview = trainingData.has_review === true;
        const participantReg = registrationData.participants?.find(
            p => p.registration_participant_id === id
        );

        const noCert = participantReg?.no_certificate === true;

        const hasCert =
            typeof trainingData.cert_file === "string" &&
            trainingData.cert_file.trim() !== "";

        const isCancelled = status === 5;

        if (isCancelled) {
            return [
                {
                    id: 0,
                    label: "Registration Cancelled",
                    description:
                        "This registration has been cancelled. All further training processes are stopped.",
                    status: "cancelled",
                    icon: XCircle,
                },
                {
                    id: 1,
                    label: "Registration Submitted",
                    description: "Registration was submitted before cancellation.",
                    status: "pending",
                    icon: Clock,
                },
                {
                    id: 2,
                    label: "Payment Verification",
                    description: "Payment process was stopped due to cancellation.",
                    status: "pending",
                    icon: Clock,
                },
                {
                    id: 3,
                    label: "Registration Validation",
                    description: "Validation was stopped due to cancellation.",
                    status: "pending",
                    icon: Clock,
                },
                {
                    id: 4,
                    label: "Training Completion",
                    description: "Training will not be conducted because registration was cancelled.",
                    status: "pending",
                    icon: Clock,
                },
                {
                    id: 5,
                    label: "Certificate Issuance",
                    description: "Certificate will not be issued for cancelled registration.",
                    status: "pending",
                    icon: Clock,
                },
            ];
        }

        const steps = [
            {
                id: 1,
                label: "Registration Submitted",
                description:
                    "Your registration has been submitted and is being reviewed by admin.",
                status: status >= 1 ? "completed" : "pending",
                icon: CheckCircle2,
            },
            {
                id: 2,
                label: "Payment Verification",
                description:
                    status === 1
                        ? "Waiting for admin to request payment proof."
                        : status === 2
                            ? "Please upload your payment proof to proceed."
                            : status >= 3
                                ? "Payment has been verified."
                                : "Payment verification pending.",
                status:
                    status === 1
                        ? "pending"
                        : status === 2
                            ? "current"
                            : status >= 3
                                ? "completed"
                                : "pending",
                icon: status >= 3 ? CheckCircle2 : status === 2 ? AlertCircle : Clock,
                action: !isCancelled && status === 2 && (
                    <Button
                        variant="orange"
                        size="sm"
                        onClick={() => setShowPaymentDialog(true)}
                        className="mt-2 w-full sm:w-auto"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Payment Proof
                    </Button>
                ),
                preview:
                    registrationData.payment_proof && status >= 3 ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setPreviewDoc({
                                    url: registrationData.payment_proof,
                                    title: "Payment Proof",
                                });
                                setShowDocPreview(true);
                            }}
                            className="mt-2 w-full sm:w-auto"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            View Payment Proof
                        </Button>
                    ) : null,
            },
            {
                id: 3,
                label: "Registration Validated",
                description:
                    status >= 3
                        ? "Your registration has been validated. Please attend the training on the scheduled date."
                        : "Waiting for admin to validate your registration.",
                status: status >= 3 ? "completed" : "pending",
                icon: status >= 3 ? CheckCircle2 : Clock,
            },
            {
                id: 4,
                label: "Training Completed",
                description:
                    status === 4
                        ? attendanceStatus === null
                            ? "Training completed. Waiting for admin to mark your attendance."
                            : attendanceStatus === false
                                ? "You were marked as absent from this training."
                                : hasReview
                                    ? "Training completed and review submitted. Thank you for your feedback!"
                                    : "Training completed. Please submit your review to continue."
                        : "Training will be marked as completed after the scheduled date.",
                status:
                    status === 4
                        ? attendanceStatus === false
                            ? "cancelled"
                            : attendanceStatus === true
                                ? "completed"
                                : "current"
                        : "pending",
                icon:
                    status === 4
                        ? attendanceStatus === false
                            ? XCircle
                            : attendanceStatus === true
                                ? CheckCircle2
                                : Clock
                        : Clock,
                content:
                    status === 4 && attendanceStatus === true ? (
                        <div className="mt-3 space-y-3">
                            {/* Review Section */}
                            <div className="border-t pt-3">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Your Review
                                </h4>
                                {hasReview ? (
                                    <ReviewDisplay
                                        participantId={id}
                                        onEdit={() => setShowReviewDialog(true)}
                                    />
                                ) : (
                                    <div className="bg-orange-50 border border-mainOrange rounded-lg p-3">
                                        <p className="text-sm text-gray-700 mb-3">
                                            Please share your experience by submitting a review.
                                        </p>
                                        <Button
                                            variant="orange"
                                            size="sm"
                                            onClick={() => setShowReviewDialog(true)}
                                            className="w-full sm:w-auto"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Write Review
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Advantech Certificate Section - Only show after review */}
                            {hasReview && (
                                <div className="border-t pt-3">
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Advantech Certificate
                                    </h4>
                                    {trainingData.advantech_cert?.length > 0 ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setPreviewDoc({
                                                    urls: trainingData.advantech_cert,
                                                    title: "Advantech Certificate",
                                                    isMultiple: true,
                                                });
                                                setShowDocPreview(true);
                                            }}
                                            className="w-full sm:w-auto"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Advantech Certificate
                                        </Button>
                                    ) : (
                                        <div className="bg-blue-50 border border-mainBlue rounded-lg p-3">
                                            <p className="text-sm text-gray-700 mb-3">
                                                Upload your Advantech certificate if available (optional).
                                            </p>
                                            <Button
                                                variant="lightBlue"
                                                size="sm"
                                                onClick={() => setShowAdvantechDialog(true)}
                                                className="w-full sm:w-auto"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Advantech Certificate
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : null,
            },
            {
                id: 5,
                label: "Certificate Issuance",

                description:
                    status === 4 && attendanceStatus === true
                        ? !hasReview
                            ? "Please submit your review first to proceed with certificate issuance."
                            : noCert
                                ? "This training does not provide an official certificate."
                                : hasCert
                                    ? "Your certificate has been issued and is ready for download."
                                    : "Your certificate is being processed by admin. Please wait for notification."
                        : "Certificate will be issued after training completion and review submission.",

                status:
                    status === 4 && attendanceStatus === true
                        ? !hasReview
                            ? "pending"
                            : noCert
                                ? "completed"
                                : hasCert
                                    ? "completed"
                                    : "current"
                        : "pending",

                icon:
                    status === 4 && attendanceStatus === true
                        ? !hasReview
                            ? Clock
                            : noCert
                                ? AlertCircle
                                : hasCert
                                    ? Award
                                    : Clock
                        : Clock,
                content:
                    status === 4 && attendanceStatus === true && hasReview && hasCert ? (
                        <div className="mt-3 space-y-3">
                            {/* Certificate Details */}
                            {certificateData && (
                                <div className="bg-green-50 border border-success1 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Certificate Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-neutral3 text-xs">Certificate Number</p>
                                            <p className="font-semibold">
                                                {certificateData.original_number ||
                                                    certificateData.certificate_number}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral3 text-xs">Issued Date</p>
                                            <p className="font-semibold">
                                                {new Date(certificateData.issued_date).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral3 text-xs">Expiry Date</p>
                                            <p className="font-semibold">
                                                {certificateData.expired_date
                                                    ? new Date(
                                                        certificateData.expired_date
                                                    ).toLocaleDateString("en-US", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "No Expiry"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral3 text-xs">Status</p>
                                            <p
                                                className={`font-semibold ${certificateData.status_certificate === "Valid"
                                                    ? "text-success1"
                                                    : "text-error1"
                                                    }`}
                                            >
                                                {certificateData.status_certificate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                        <Button
                                            variant="lightBlue"
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(
                                                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/download/${id}`
                                                    );
                                                    if (!res.ok) throw new Error("Download failed");
                                                    const blob = await res.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement("a");
                                                    a.href = url;
                                                    a.download = `Certificate-${trainingData.training_name}.pdf`;
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                } catch (error) {
                                                    console.error("Download error:", error);
                                                    alert("Failed to download certificate");
                                                }
                                            }}
                                            className="flex-1"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Certificate
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.push(`/certificate/${certificateData?.certificate_number}`)
                                            }
                                            className="flex-1"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View Full Details
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : status === 4 && attendanceStatus === true && hasReview && noCert ? (
                        <div className="mt-3 bg-orange-50 border border-mainOrange rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-mainOrange mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Uncertified Training
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        This training does not provide an official certificate. You have successfully completed the training.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null,
            },
        ];

        return steps;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "border-success1 bg-success2/10";
            case "current":
                return "border-mainOrange bg-orange-50";
            case "cancelled":
                return "border-error1 bg-error2/10";
            default:
                return "border-neutral2 bg-neutral1";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success1" />;
            case "current":
                return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-mainOrange" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-error1" />;
            default:
                return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-neutral3" />;
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!trainingData || !registrationData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <NotFound
                    message="Training history not found. This record may have been deleted."
                    buttons={[{ text: "Back to Profile", href: "/edit-profile" }]}
                />
            </div>
        );
    }

    const statusSteps = getStatusInfo();

    return (
        <div className="min-h-screen bg-neutral1 py-4 sm:py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-mainBlue mb-3 sm:mb-2">
                                {trainingData.training_name}
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                <InfoRow
                                    label="Registration ID"
                                    value={registrationData.registration_id}
                                />
                                <InfoRow
                                    label="Participant ID"
                                    value={trainingData.registration_participant_id}
                                />
                                <InfoRow
                                    label="Registration Date"
                                    value={new Date(
                                        registrationData.registration_date
                                    ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                />
                                <InfoRow
                                    label="Training Date"
                                    value={new Date(
                                        registrationData.training_date
                                    ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.push(`/training/${registrationData.training_id}`)
                            }
                            className="w-full sm:w-auto"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">View Training Details</span>
                            <span className="sm:hidden">Training Details</span>
                        </Button>
                    </div>
                </div>

                {/* Cancelled Status Warning */}
                {registrationData.status === 5 && (
                    <div className="bg-error2/10 border border-error1 rounded-lg p-4 mb-4 sm:mb-6">
                        <div className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-error1 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-error1 text-sm sm:text-base">
                                    Registration Cancelled
                                </h3>
                                <p className="text-sm text-gray-700 mt-1">
                                    Your registration for this training has been cancelled. If you
                                    believe this is a mistake, please{" "}
                                    <a
                                        href="mailto:info@efortechsolutions.com"
                                        className="text-mainOrange font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        contact our support team
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-mainBlue mb-4 sm:mb-6">
                        Registration Progress
                    </h2>

                    <div className={`space-y-4 sm:space-y-6 ${registrationData.status === 5 ? "opacity-60 grayscale" : ""}`}>
                        {statusSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === statusSteps.length - 1;

                            return (
                                <div key={step.id} className="relative">
                                    {/* Timeline line */}
                                    {!isLast && (
                                        <div
                                            className={`absolute left-[11px] top-8 w-0.5 h-full ${statusSteps[index + 1].status !== "pending"
                                                ? "bg-success1"
                                                : "bg-neutral2"
                                                }`}
                                        />
                                    )}

                                    {/* Step content */}
                                    <div className="flex gap-3 sm:gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.status === "completed"
                                                ? "bg-success1 border-success1"
                                                : step.status === "current"
                                                    ? "bg-mainOrange border-mainOrange"
                                                    : step.status === "cancelled"
                                                        ? "bg-error1 border-error1"
                                                        : "bg-white border-neutral2"
                                                }`}
                                        >
                                            <Icon
                                                className={`w-3 h-3 sm:w-4 sm:h-4 ${step.status === "completed" ||
                                                    step.status === "current" ||
                                                    step.status === "cancelled"
                                                    ? "text-white"
                                                    : "text-neutral3"
                                                    }`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pb-6 sm:pb-8 min-w-0">
                                            <div
                                                className={`border-2 rounded-lg p-3 sm:p-4 ${getStatusColor(
                                                    step.status
                                                )}`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-sm sm:text-base flex-1 min-w-0">
                                                        {step.label}
                                                    </h3>
                                                    {getStatusIcon(step.status)}
                                                </div>
                                                <p className="text-xs sm:text-sm mt-2 text-gray-700">
                                                    {step.description}
                                                </p>

                                                {/* Actions */}
                                                {step.action && <div className="mt-3">{step.action}</div>}

                                                {/* Preview */}
                                                {step.preview && <div className="mt-2">{step.preview}</div>}

                                                {/* Additional Content */}
                                                {step.content && <div>{step.content}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dialogs */}
                <UploadPaymentDialog
                    open={showPaymentDialog}
                    onOpenChange={(open) => {
                        setShowPaymentDialog(open);
                        if (!open) refreshData();
                    }}
                    registrationId={registrationData.registration_id}
                />

                <UploadCertificateDialog
                    open={showAdvantechDialog}
                    onOpenChange={(open) => {
                        setShowAdvantechDialog(open);
                        if (!open) refreshData();
                    }}
                    registrationParticipantId={id}
                    registrationId={registrationData.registration_id}
                    onSuccess={refreshData}
                />

                <DocumentPreviewDialog
                    open={showDocPreview}
                    onClose={() => {
                        setShowDocPreview(false);
                        setPreviewDoc(null);
                    }}
                    document={previewDoc}
                />

                <ReviewDialog
                    open={showReviewDialog}
                    onClose={() => {
                        setShowReviewDialog(false);
                        refreshData();
                    }}
                    registrationParticipantId={id}
                    trainingName={trainingData.training_name}
                    trainingDate={registrationData.training_date}
                />
            </div>
        </div>
    );
}

// Helper component for info rows
const InfoRow = ({ label, value }) => (
    <div>
        <p className="text-neutral3 text-xs font-medium">{label}</p>
        <p className="text-black font-semibold mt-1 text-sm break-words">{value}</p>
    </div>
);

// Review Display Component
const ReviewDisplay = ({ participantId, onEdit }) => {
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/${participantId}`
                );
                const result = await res.json();

                if (res.ok && result.data) {
                    setReviewData(result.data);
                }
            } catch (err) {
                console.error("Error fetching review:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [participantId]);

    if (loading) {
        return (
            <div className="bg-neutral1 rounded-lg p-3">
                <p className="text-sm text-neutral3">Loading review...</p>
            </div>
        );
    }

    if (!reviewData) {
        return null;
    }

    return (
        <div className="bg-green-50 border border-success1 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Star
                            key={index}
                            size={16}
                            fill={index <= reviewData.score ? "#FBBF24" : "none"}
                            stroke="#FBBF24"
                            className="flex-shrink-0"
                        />
                    ))}
                </div>
                <span className="text-sm font-semibold">{reviewData.score}/5</span>
            </div>
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {reviewData.review_description}
            </p>
            <Button variant="outline" size="sm" onClick={onEdit} className="w-full sm:w-auto">
                <MessageSquare className="w-4 h-4 mr-2" />
                View Full Review
            </Button>
        </div>
    );
};