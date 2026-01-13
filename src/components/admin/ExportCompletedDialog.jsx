// efortech_edu\src\components\admin\ExportCompletedDialog.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import toast from "react-hot-toast";

export default function ExportCompletedDialog({ open, onClose }) {
    const [dateType, setDateType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCompletionType, setSelectedCompletionType] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState("");
    const [trainingList, setTrainingList] = useState([]);
    const [advantechCert, setAdvantechCert] = useState("");

    const completionTypes = [
        { label: "Certified", value: "certified" },
        { label: "No Certificate", value: "no_certificate" },
        { label: "Absent", value: "absent" },
    ];

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training?status=all`);
                const data = await res.json();
                setTrainingList(data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch training data");
            }
        };
        fetchTrainings();
    }, []);

    if (!open) return null;

    const handleExport = async (type) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not logged in");
            const token = await getIdToken(currentUser);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/registrations/completed`;

            if (type !== "all") {
                const params = new URLSearchParams();

                const mappedDateType =
                    dateType === "registration"
                        ? "registration_date"
                        : dateType === "training"
                            ? "training_date"
                            : dateType === "completed"
                                ? "completed_date"
                                : "";

                if (startDate) params.append("start", `${startDate}T00:00:00Z`);
                if (endDate) params.append("end", `${endDate}T23:59:59Z`);
                if (selectedCompletionType.length > 0) {
                    selectedCompletionType.forEach((t) =>
                        params.append("completion_type", t)
                    );
                }
                if (selectedTraining) params.append("training_id", selectedTraining);
                if (advantechCert) params.append("has_advantech_cert", advantechCert);
                if (mappedDateType) params.append("dateType", mappedDateType);

                if (params.toString()) url += `?${params.toString()}`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) {
                toast.error("No data found to export.");
                return;
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                const errMsg = errData?.message || "Export failed.";
                toast.error(errMsg);
                return;
            }

            const blob = await res.blob();
            const contentDisposition = res.headers.get("Content-Disposition");
            let fileName = "exported_completed.xlsx";

            if (contentDisposition && contentDisposition.includes("filename=")) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) fileName = match[1];
            }

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);

            toast.success("Completed training data exported successfully.");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Export failed. Please try again.");
        }
    };

    const clearFilters = () => {
        setSelectedTraining("");
        setSelectedCompletionType([]);
        setDateType("");
        setStartDate("");
        setEndDate("");
        setAdvantechCert("");
    };

    const hasFilters =
        (startDate && endDate) ||
        selectedCompletionType.length > 0 ||
        selectedTraining ||
        advantechCert;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="relative bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
                    <h2 className="text-lg sm:text-xl font-bold mb-1">Export Completed</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Export completed training registration data.
                    </p>
                    <button
                        onClick={onClose}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="px-4 sm:px-6 py-4 space-y-4">
                    {/* Date Type Selection */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Date Type</Label>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <label className="flex items-center gap-2 text-xs sm:text-sm">
                                <input
                                    type="radio"
                                    name="dateType"
                                    value="registration"
                                    checked={dateType === "registration"}
                                    onChange={(e) => setDateType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                Registration Date
                            </label>
                            <label className="flex items-center gap-2 text-xs sm:text-sm">
                                <input
                                    type="radio"
                                    name="dateType"
                                    value="training"
                                    checked={dateType === "training"}
                                    onChange={(e) => setDateType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                Training Date
                            </label>
                            <label className="flex items-center gap-2 text-xs sm:text-sm">
                                <input
                                    type="radio"
                                    name="dateType"
                                    value="completed"
                                    checked={dateType === "completed"}
                                    onChange={(e) => setDateType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                Completed Date
                            </label>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <Label className="text-xs sm:text-sm mb-2 block font-semibold">Date Range</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <Label htmlFor="startDate" className="text-xs text-gray-500 mb-1">
                                    From
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    className="w-full text-sm"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="endDate" className="text-xs text-gray-500 mb-1">
                                    To
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    className="w-full text-sm"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Completion Status</Label>
                        <div className="flex flex-wrap gap-3">
                            {completionTypes.map((ct) => (
                                <div key={ct.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={ct.value}
                                        checked={selectedCompletionType.includes(ct.value)}
                                        onCheckedChange={() =>
                                            setSelectedCompletionType((prev) =>
                                                prev.includes(ct.value)
                                                    ? prev.filter((v) => v !== ct.value)
                                                    : [...prev, ct.value]
                                            )
                                        }
                                    />
                                    <Label htmlFor={ct.value}>{ct.label}</Label>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Training Dropdown */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Training</Label>
                        <Select value={selectedTraining} onValueChange={setSelectedTraining}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue placeholder="Select a training" />
                            </SelectTrigger>
                            <SelectContent>
                                {trainingList.map((t) => (
                                    <SelectItem key={t.training_id} value={t.training_id}>
                                        {t.training_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advantech Certificate */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Advantech Certificate</Label>
                        <Select value={advantechCert} onValueChange={setAdvantechCert}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue placeholder="Select certificate availability" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='true'>Yes</SelectItem>
                                <SelectItem value='false'>No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Footer - Sticky */}
                <div className="sticky bottom-0 bg-white border-t px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between sm:items-center">
                        <Button
                            onClick={() => handleExport("all")}
                            variant="mainBlue"
                            className="w-full sm:w-auto text-sm"
                        >
                            Export All
                        </Button>

                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="w-full sm:w-auto text-sm"
                        >
                            Clear Filter
                        </Button>

                        <Button
                            onClick={() => handleExport("custom")}
                            variant={hasFilters ? "orange" : "outline"}
                            disabled={!hasFilters}
                            className="w-full sm:w-auto text-sm"
                        >
                            Export Custom
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}