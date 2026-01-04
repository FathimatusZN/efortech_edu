// efortech_edu\src\components\admin\ExportAllCertificatesDialog.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ExportAllCertificatesDialog({ open, onClose }) {
    const [dateType, setDateType] = useState("issued_date");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedType, setSelectedType] = useState([]);
    const [selectedCertStatus, setSelectedCertStatus] = useState([]);

    const types = [
        { label: "Training Certificates", value: "1" },
        { label: "User Upload Certificates", value: "2" },
    ];

    const certStatuses = [
        { label: "Valid", value: "valid" },
        { label: "Expired", value: "expired" },
    ];

    if (!open) return null;

    const toggleType = (value) => {
        setSelectedType((prev) =>
            prev.includes(value)
                ? prev.filter((s) => s !== value)
                : [...prev, value]
        );
    };

    const toggleCertStatus = (value) => {
        setSelectedCertStatus((prev) =>
            prev.includes(value)
                ? prev.filter((s) => s !== value)
                : [...prev, value]
        );
    };

    const handleExport = async (type) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not logged in");
            const token = await getIdToken(currentUser);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/allcertificates`;

            let res;
            if (type === "all") {
                // Export All - no query params
                res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                const params = new URLSearchParams();
                params.append("dateType", dateType);

                if (startDate) params.append("start", startDate);
                if (endDate) params.append("end", endDate);

                // Only send one type value (if only one is selected)
                if (selectedType.length === 1) {
                    params.append("type", selectedType[0]);
                }
                // If both or none selected, don't add type param (means all)

                if (selectedCertStatus.length > 0) {
                    // Only send one certificate_status value (the first selected)
                    params.append("certificate_status", selectedCertStatus[0]);
                }

                if (params.toString()) url += `?${params.toString()}`;

                res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                const errMsg = errData?.message || "Export failed.";

                if (errMsg.toLowerCase().includes("no") && errMsg.toLowerCase().includes("data")) {
                    toast.error("No data available to export.");
                } else {
                    toast.error(errMsg);
                }

                return;
            }

            const blob = await res.blob();
            const contentDisposition = res.headers.get("Content-Disposition");
            let fileName = "exported_data.xlsx";

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

            toast.success("All certificates data exported successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Export failed. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="relative bg-white rounded-lg p-6 w-[460px] shadow-lg">
                <h2 className="text-xl font-bold mb-1">Export All Certificates</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Export training and user uploaded certificate data with custom filters.
                </p>

                {/* Date Type Selection */}
                <div className="mb-4">
                    <Label className="text-sm block mb-2">Date Type</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dateType"
                                value="issued_date"
                                checked={dateType === "issued_date"}
                                onChange={(e) => setDateType(e.target.value)}
                            />
                            Issued Date
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dateType"
                                value="expired_date"
                                checked={dateType === "expired_date"}
                                onChange={(e) => setDateType(e.target.value)}
                            />
                            Expired Date
                        </label>
                    </div>
                </div>

                {/* Date Range */}
                <div className="mb-4">
                    <Label className="text-sm mb-2 block">Date Range</Label>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <Label htmlFor="startDate" className="text-xs text-gray-500 mb-1">
                                From
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                className="w-48"
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
                                className="w-48"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Certificate Type */}
                <div className="mb-4">
                    <Label className="text-sm block mb-2">Certificate Type</Label>
                    <div className="flex flex-wrap gap-3">
                        {types.map((t) => (
                            <div key={t.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={t.value}
                                    checked={selectedType.includes(t.value)}
                                    onCheckedChange={() => toggleType(t.value)}
                                />
                                <Label htmlFor={t.value} className="text-sm">
                                    {t.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certificate Status */}
                <div className="mb-5">
                    <Label className="text-sm block mb-2">Certificate Status</Label>
                    <div className="flex flex-wrap gap-3">
                        {certStatuses.map((st) => (
                            <div key={st.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={st.value}
                                    checked={selectedCertStatus.includes(st.value)}
                                    onCheckedChange={() => toggleCertStatus(st.value)}
                                />
                                <Label htmlFor={st.value} className="text-sm capitalize">
                                    {st.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6">
                    <Button onClick={() => handleExport("all")} variant="mainBlue">
                        Export All
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSelectedType([]);
                            setSelectedCertStatus([]);
                            setDateType("issued_date");
                            setStartDate("");
                            setEndDate("");
                        }}
                    >
                        Clear Filter
                    </Button>

                    <Button
                        onClick={() => handleExport("custom")}
                        variant={
                            (startDate && endDate) ||
                                selectedType.length > 0 ||
                                selectedCertStatus.length > 0
                                ? "orange"
                                : "outline"
                        }
                        disabled={
                            !(
                                (startDate && endDate) ||
                                selectedType.length > 0 ||
                                selectedCertStatus.length > 0
                            )
                        }
                    >
                        Export Custom
                    </Button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}