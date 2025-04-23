"use client";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Switch } from "@/components/ui/switch"
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
                    <div className="outline outline-3 outline-mainBlue p-6 bg-white shadow-md rounded-lg border w-full">

                        {/* Training name Input & Switch Status*/}
                        <div className="flex flex-wrap md:flex-nowrap gap-8 justify-between">
                            {/* Training name Input */}
                            <div className="w-full md:w-[75%] flex flex-col space-y-4">
                                <InputField
                                    label="Training Name"
                                    placeholder="Type training name here.."
                                    required
                                    className="mt-2"
                                    value={training_name}
                                    onChange={(e) => setTrainingname(e.target.value)}
                                />
                            </div>

                            {/* Status Switch */}
                            <div className="w-full sm:w-40 justify-right">
                                <label className="text-lg font-semibold block mb-2">Training Status</label>
                                <div className="flex items-center justify-start gap-x-4 mb-1">
                                    <span className="text-md text-gray-600 min-w-[70px] text-left">
                                        {status === 1 ? 'Active' : 'Archived'}
                                    </span>
                                    <Switch
                                        checked={status === 1}
                                        onCheckedChange={(checked) => setStatus(checked ? 1 : 2)}
                                        className="data-[state=checked]:bg-mainBlue bg-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="w-full mt-4 relative">
                            <label className="block text-md font-semibold w-full">
                                Description<span className="text-red-500"> *</span>
                            </label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                placeholder="Type description here"
                                className="mt-2 w-full border border-mainBlue p-2 pr-6 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue resize-none min-h-[80px] overflow-hidden"
                                required
                            />
                        </div>

                        {/* Level */}
                        <div className="w-full mt-4">
                            <label className="block text-md font-semibold w-full">
                                Level<span className="text-red-500"> *</span>
                            </label>
                            <div className="mt-2 flex gap-12 flex-wrap"> {/* Add flex-wrap here */}
                                {[
                                    { label: 'Beginner', value: 1 },
                                    { label: 'Medium', value: 2 },
                                    { label: 'Advanced', value: 3 },
                                ].map((item) => (
                                    <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="radio"
                                                name="level"
                                                value={item.value}
                                                checked={level === item.value}
                                                onChange={() => setLevel(item.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${level === item.value ? 'border-mainBlue' : 'border-gray-400'}`}>
                                                <div className={`w-3 h-3 rounded-full ${level === item.value ? 'bg-mainBlue' : 'bg-gray-300'}`} />
                                            </div>
                                        </div>
                                        <span className="text-sm">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Duration, Fees, Discount, Validity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
                            {/* Training Duration */}
                            <div>
                                <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
                                    Training Duration<span className="text-red-500"> *</span>
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <FaClock className="text-mainBlue" size={20} />
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            name="duration"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="Duration"
                                            className="w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue pr-16"  // Add padding to the right to fit "Hours"
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm font-regular pointer-events-none">Hours</span>
                                    </div>
                                </div>
                            </div>


                            {/* Training Fees */}
                            <div>
                                <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
                                    Training Fees<span className="text-red-500"> *</span>
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <FaMoneyBill className="text-mainBlue" size={20} />
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-sm">Rp</span>
                                        <input
                                            type="text"
                                            name="training_fees"
                                            value={training_fees}
                                            onChange={(e) => setTrainingfees(e.target.value)}
                                            placeholder="e.g. 1500000"
                                            className="w-full border border-mainBlue px-3 py-2 pl-10 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
                                    Discount
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <FaTag className="text-mainBlue" size={20} />
                                    <div className="relative w-full">
                                        <input
                                            type="number"
                                            name="discount"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            placeholder="0-100"
                                            className="w-full border border-mainBlue px-3 py-2 pr-8 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm font-semibold pointer-events-none">%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Validity */}
                            <div>
                                <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
                                    Certificate Validity Period<span className="text-red-500"> *</span>
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <FaCheckCircle className="text-mainBlue" size={20} />
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            name="validity_period"
                                            value={validity_period}
                                            onChange={(e) => setValidityperiod(e.target.value)}
                                            placeholder="Duration in months"
                                            className="w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm font-regular pointer-events-none">Months</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="w-full mt-4">
                            <label className="block text-lg font-semibold w-full">
                                Terms and Conditions<span className="text-red-500"> *</span>
                            </label>
                            <textarea
                                name="terms"
                                value={term_condition}
                                onChange={(e) => {
                                    setTermcondition(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                placeholder="Type term and condition here, one per line"
                                className="mt-2 w-full border border-mainBlue p-2 pr-6 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue resize-none min-h-[80px] overflow-hidden"
                                required
                            />
                        </div>

                        {/* Skill and Images */}
                        <div className="flex flex-wrap md:flex-nowrap gap-8 justify-between">
                            {/* Skill */}
                            <div className="w-full md:w-[40%] flex flex-col space-y-4">
                                <label className="font-semibold mt-4 block">Skills</label>
                                <SkillsInput skills={skills} setSkills={setSkills} />
                            </div>

                            {/* Images */}
                            <div className="mt-4">
                                <ImageUploader
                                    maxImages={3}
                                    images={images}
                                    setImages={setImages}
                                    onImageUpload={handleImageUpload}
                                    uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/upload-training/image`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}