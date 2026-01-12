// efortech_edu\src\components\admin\ExportTrainingDialog.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ExportTrainingDialog({ open, onClose }) {
    const [dateType, setDateType] = useState("created_date");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [minFees, setMinFees] = useState("");
    const [maxFees, setMaxFees] = useState("");

    const statuses = [
        { label: "Active", value: "1" },
        { label: "Archived", value: "2" },
    ];

    const levels = [
        { label: "Beginner", value: "1" },
        { label: "Intermediate", value: "2" },
        { label: "Advanced", value: "3" },
    ];

    if (!open) return null;

    const toggleStatus = (value) => {
        setSelectedStatus((prev) =>
            prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
        );
    };

    const toggleLevel = (value) => {
        setSelectedLevel((prev) =>
            prev.includes(value) ? prev.filter((l) => l !== value) : [...prev, value]
        );
    };

    const handleExport = async (type) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not logged in");
            const token = await getIdToken(currentUser);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/training`;

            let res;
            if (type === "all") {
                // Export All - no query params
                res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                const params = new URLSearchParams();
                params.append("dateType", dateType);

                if (startDate) params.append("start", startDate);
                if (endDate) params.append("end", endDate);

                if (selectedStatus.length > 0) {
                    params.append("status", selectedStatus.join(","));
                }

                if (selectedLevel.length > 0) {
                    params.append("level", selectedLevel.join(","));
                }

                if (minFees) params.append("min_fees", minFees);
                if (maxFees) params.append("max_fees", maxFees);

                if (params.toString()) url += `?${params.toString()}`;

                res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                const errMsg = errData?.message || "Export failed.";

                if (
                    errMsg.toLowerCase().includes("no") &&
                    errMsg.toLowerCase().includes("data")
                ) {
                    toast.error("No training data available to export.");
                } else {
                    toast.error(errMsg);
                }

                return;
            }

            const blob = await res.blob();
            const contentDisposition = res.headers.get("Content-Disposition");
            let fileName = "training_data.xlsx";

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

            toast.success("Training data exported successfully.");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Export failed. Please try again.");
        }
    };

    const clearFilters = () => {
        setSelectedStatus([]);
        setSelectedLevel([]);
        setDateType("created_date");
        setStartDate("");
        setEndDate("");
        setMinFees("");
        setMaxFees("");
    };

    const hasFilters =
        (startDate && endDate) ||
        selectedStatus.length > 0 ||
        selectedLevel.length > 0 ||
        minFees ||
        maxFees;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="relative bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
                    <h2 className="text-lg sm:text-xl font-bold mb-1">Export Training Data</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Export comprehensive training data with insights including participants,
                        graduates, reviews, and revenue.
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
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="dateType"
                                    value="created_date"
                                    checked={dateType === "created_date"}
                                    onChange={(e) => setDateType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                Created Date
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="dateType"
                                    value="available_date"
                                    checked={dateType === "available_date"}
                                    onChange={(e) => setDateType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                Available Date
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

                    {/* Status Filter */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Status</Label>
                        <div className="flex flex-wrap gap-3">
                            {statuses.map((s) => (
                                <div key={s.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`status-${s.value}`}
                                        checked={selectedStatus.includes(s.value)}
                                        onCheckedChange={() => toggleStatus(s.value)}
                                    />
                                    <Label htmlFor={`status-${s.value}`} className="text-xs sm:text-sm cursor-pointer">
                                        {s.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Level Filter */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Level</Label>
                        <div className="flex flex-wrap gap-3">
                            {levels.map((l) => (
                                <div key={l.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`level-${l.value}`}
                                        checked={selectedLevel.includes(l.value)}
                                        onCheckedChange={() => toggleLevel(l.value)}
                                    />
                                    <Label htmlFor={`level-${l.value}`} className="text-xs sm:text-sm cursor-pointer">
                                        {l.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Training Fees Range */}
                    <div>
                        <Label className="text-xs sm:text-sm mb-2 block font-semibold">Training Fees Range (Rp)</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <Label htmlFor="minFees" className="text-xs text-gray-500 mb-1">
                                    Min
                                </Label>
                                <Input
                                    id="minFees"
                                    type="number"
                                    placeholder="0"
                                    className="w-full text-sm"
                                    value={minFees}
                                    onChange={(e) => setMinFees(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="maxFees" className="text-xs text-gray-500 mb-1">
                                    Max
                                </Label>
                                <Input
                                    id="maxFees"
                                    type="number"
                                    placeholder="10000000"
                                    className="w-full text-sm"
                                    value={maxFees}
                                    onChange={(e) => setMaxFees(e.target.value)}
                                />
                            </div>
                        </div>
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