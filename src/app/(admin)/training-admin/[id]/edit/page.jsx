"use client";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TrainingForm from "@/components/admin/TrainingForm";
import { PageTitle, SaveButton, DiscardButton, InputField, ImageUploader, SkillsInput } from "@/components/layout/InputField";
import { useParams, useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { FaClock, FaMoneyBill, FaTag, FaCheckCircle } from "react-icons/fa";

export default function EditTraining() {
    const params = useParams();
    const router = useRouter();

    const trainingId = params.id;
    const [isLoading, setIsLoading] = useState(true);

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
    const [skills, setSkills] = useState([]);
    const [images, setImages] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const isFormValid = training_name.trim() !== "" && description.trim() !== "" && level !== 0 && duration !== "" && training_fees !== "" && validity_period !== "" && term_condition !== "" && skills !== "";
    const { user } = useAuth();

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/id/${trainingId}`);
                if (!response.ok) throw new Error("Failed to fetch training data");
                const data = await response.json();

                setTrainingname(data.data.training_name);
                setStatus(data.data.status);
                setDescription(data.data.description);
                setLevel(data.data.level);
                setDuration(data.data.duration);
                setTrainingfees(data.data.training_fees);
                setDiscount(data.data.setDiscount || 0);
                setValidityperiod(data.data.validity_period);
                setTermcondition(data.data.term_condition);
                setSkills(data.data.skills || []);
                setImages(data.data.images || []);
            } catch (err) {
                console.error("Error fetching training:", err);
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
        console.log("🧪 Current user object:", user);

        try {
            const token = localStorage.getItem("token");
            const cleanImages = images.filter((url) => typeof url === "string" && url.startsWith("http"));

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
                skills: skills.filter(skill => skill.trim() !== ""),
                images: cleanImages,
            };

            console.log("Payload sent to backend:", payload);

            if (!training_name || !status || !description || !level || !duration || !training_fees || !validity_period || !term_condition || !skills) {
                alert("Please fill in the required fields!");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/update/${trainingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update training");

            const data = await res.json();
            alert("✅ Training updated! ID: " + `${trainingId}`);
            resetForm();
            router.push(`/training-admin/${trainingId}`);

        } catch (err) {
            console.error("❌ Update error:", err);
            alert("Failed to update training.");
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

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            {isLoading ? (
                <div className="text-center mt-10">Loading training data...</div>
            ) : (
                <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                    <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mb-2 gap-4">
                        <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-4 gap-4">
                            {/* Title */}
                            <PageTitle title="Edit Training" />

                            {/* Save & Discard Button */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                {/* Save Button */}
                                <SaveButton onClick={handleSubmit} disabled={!isFormValid} />

                                {/* Discard Button */}
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

                    {/* Main Training Form */}
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
                </div>
            )}
        </ProtectedRoute>
    );
}