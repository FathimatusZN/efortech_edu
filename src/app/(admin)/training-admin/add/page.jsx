"use client";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TrainingForm from "@/components/admin/TrainingForm";
import {
  PageTitle,
  SaveButton,
  DiscardButton,
} from "@/components/layout/InputField";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export default function AddTraining() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // State for managing field
  const [training_name, setTrainingname] = useState("");
  const [status, setStatus] = useState(1);
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(1);
  const [duration, setDuration] = useState("");
  const [training_fees, setTrainingfees] = useState("");
  const [discount, setDiscount] = useState("");
  const [validity_period, setValidityperiod] = useState("");
  const [term_condition, setTermcondition] = useState("");
  const [skills, setSkills] = useState([""]);
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
    skills !== "";
  const { user } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [trainingId, setTrainingId] = useState(null);

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
        duration: parseInt(duration),
        training_fees: parseInt(training_fees),
        discount: parseInt(discount || "0"), // default 0
        validity_period: parseInt(validity_period),
        term_condition,
        skills: skills.filter((skill) => skill.trim() !== ""),
        images: cleanImages,
        admin_id: user.user_id, // Add admin_id
      };

      if (
        !training_name ||
        !status ||
        !description ||
        !level ||
        !duration ||
        !training_fees ||
        !validity_period ||
        !term_condition ||
        !skills
      ) {
        alert("Please fill in the required fields!");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to create training");

      const data = await res.json();
      setTrainingId(data.data.training_id);
      setShowSuccess(true);
      resetForm();
    } catch (err) {
      console.error("❌ Create error:", err);
      setShowError(true);
    }
  };

  const handleImageUpload = (imageUrl) => {
    setImages((prevImages) => [...prevImages, imageUrl]);
  };

  const handleDiscard = () => {
    resetForm();
    setOpenDialog(false);
    router.push(`/training-admin`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      {isLoading ? (
        <div className="text-center mt-10">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
          <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mb-2 gap-4">
            <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-4 gap-4">
              <PageTitle title="Add New Training" />

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              
                <SaveButton onClick={handleSubmit} disabled={!isFormValid} />

                <DiscardButton onClick={() => setOpenDialog(true)} />
              </div>
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
            messages={["New training created!", `ID: ${trainingId}`]}
            buttonText="See Training"
            onButtonClick={() => {
              router.push(`/training-admin/${trainingId}`);
            }}
          />

          <SuccessDialog
            open={showError}
            onOpenChange={(open) => setShowError(open)}
            title="Update Failed"
            messages={[
              "Something went wrong while add the training.",
              "Please try again later or check your form.",
            ]}
            buttonText="Close"
          />
        </div>
      )}
    </ProtectedRoute>
  );
}
