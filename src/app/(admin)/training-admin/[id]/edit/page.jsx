"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TrainingForm from "@/components/admin/TrainingForm";
import {
    PageTitle,
    SaveButton,
    DiscardButton,
} from "@/components/layout/InputField";
import { useParams, useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { NotFound } from "@/components/ui/ErrorPage";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditTraining() {
    const params = useParams();
    const router = useRouter();
    const trainingId = params.id;

    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Form fields state
    const [training_name, setTrainingname] = useState("");
    const [status, setStatus] = useState(1);
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState(1);
    const [duration, setDuration] = useState("");
    const [training_fees, setTrainingfees] = useState("");
    const [discount, setDiscount] = useState("");
    const [validity_period, setValidityperiod] = useState("");
    const [term_condition, setTermcondition] = useState("");
    const [skills, setSkills] = useState([]);
    const [images, setImages] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const isFormValid =
        training_name.trim() !== "" &&
        description.trim() !== "" &&
        level !== 0 &&
        duration !== "" &&
        training_fees !== "" &&
        validity_period !== "" &&
        term_condition !== "" &&
        skills.length > 0;

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${trainingId}`
                );

                if (!response.ok) {
                    setNotFound(true);
                    return;
                }

                const data = await response.json();
                const training = data.data;

                if (!training) {
                    setNotFound(true);
                    return;
                }

                setTrainingname(training.training_name);
                setStatus(training.status);
                setDescription(training.description);
                setLevel(training.level);
                setDuration(training.duration);
                setTrainingfees(training.training_fees);
                setDiscount(training.discount || 0);
                setValidityperiod(training.validity_period);
                setTermcondition(training.term_condition);
                setSkills(training.skills || []);
                setImages(training.images || []);
            } catch (err) {
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (trainingId) fetchTraining();
    }, [trainingId]);

    const resetForm = () => {
        setTrainingname("");
        setDescription("");
        setLevel(0);
        setDuration("");
        setTrainingfees("");
        setDiscount("");
        setValidityperiod("");
        setTermcondition("");
        setSkills([]);
        setImages([]);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const cleanImages = images.filter(
                (url) => typeof url === "string" && url.startsWith("http")
            );

            const payload = {
                training_name,
                status,
                description,
                level,
                duration,
                training_fees,
                discount,
                validity_period,
                term_condition,
                skills: skills.filter((skill) => skill.trim() !== ""),
                images: cleanImages,
            };

            if (!isFormValid) {
                setShowError(true);
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/update/${trainingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Failed to update training");

            setShowSuccess(true);
            resetForm();
        } catch (err) {
            setShowError(true);
        }
    };

    const handleImageUpload = (imageUrl) => {
        setImages((prevImages) => [...prevImages, imageUrl]);
    };

    const handleDiscard = () => {
        resetForm();
        setOpenDialog(false);
        router.push(`/training-admin/${trainingId}`);
    };

    if (!isLoading && notFound) {
        return (
            <NotFound message="Oops! We couldn't find the training you're looking for." buttons={[{ text: "Back to Training Page", href: "/training-admin" }]} />
        );
    }

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            {isLoading ? (
                <div className="text-center mt-10"><LoadingSpinner /></div>
            ) : (
                <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen pb-8">
                    <div className="flex flex-wrap justify-between items-center w-full mb-4 gap-4">
                        <PageTitle title="Edit Training" />

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <SaveButton onClick={handleSubmit} disabled={!isFormValid} />
                            <DiscardButton onClick={() => setOpenDialog(true)} />
                        </div>
                    </div>

                    <ConfirmDialog
                        open={openDialog}
                        onCancel={() => setOpenDialog(false)}
                        onConfirm={handleSubmit}
                        onDiscard={handleDiscard}
                    />

                    <TrainingForm
                        training_name={training_name}
                        setTrainingname={setTrainingname}
                        status={status}
                        setStatus={setStatus}
                        description={description}
                        setDescription={setDescription}
                        level={level}
                        setLevel={setLevel}
                        duration={duration}
                        setDuration={setDuration}
                        training_fees={training_fees}
                        setTrainingfees={setTrainingfees}
                        discount={discount}
                        setDiscount={setDiscount}
                        validity_period={validity_period}
                        setValidityperiod={setValidityperiod}
                        term_condition={term_condition}
                        setTermcondition={setTermcondition}
                        skills={skills}
                        setSkills={setSkills}
                        images={images}
                        setImages={setImages}
                        onImageUpload={handleImageUpload}
                        onSubmit={handleSubmit}
                    />

                    <SuccessDialog
                        open={showSuccess}
                        onOpenChange={(open) => {
                            setShowSuccess(open);
                            if (!open) {
                                resetForm();
                                router.push(`/training-admin/${trainingId}`);
                            }
                        }}
                        title="Training Updated!"
                        messages={[
                            "Your changes have been successfully saved.",
                            "Redirecting to training detail..."
                        ]}
                        buttonText="Continue"
                        onButtonClick={() => {
                            router.push(`/training-admin/${trainingId}`);
                        }}
                    />

                    <SuccessDialog
                        open={showError}
                        onOpenChange={(open) => setShowError(open)}
                        title="Update Failed"
                        messages={[
                            "Something went wrong while update the training.",
                            "Please try again later or check your form. Make sure all required fields are filled with valid inputs.",
                        ]}
                        buttonText="Close"
                        type="error"
                    />
                </div>
            )}
        </ProtectedRoute>
    );
}
