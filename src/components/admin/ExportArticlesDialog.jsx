// efortech_edu\src\components\admin\ExportArticlesDialog.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ExportArticlesDialog({ open, onClose }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [authorFilter, setAuthorFilter] = useState("");
    const [minViews, setMinViews] = useState("");
    const [maxViews, setMaxViews] = useState("");

    const categories = [
        { label: "Education", value: "1" },
        { label: "Event", value: "2" },
        { label: "Success Story", value: "3" },
    ];

    if (!open) return null;

    const toggleCategory = (value) => {
        setSelectedCategory((prev) =>
            prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
        );
    };

    const handleExport = async (type) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not logged in");
            const token = await getIdToken(currentUser);

            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/articles`;

            let res;
            if (type === "all") {
                // Export All - no query params
                res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                const params = new URLSearchParams();
                params.append("dateType", "create_date");

                if (startDate) params.append("start", startDate);
                if (endDate) params.append("end", endDate);

                if (selectedCategory.length > 0) {
                    params.append("category", selectedCategory.join(","));
                }

                if (authorFilter) params.append("author", authorFilter);
                if (minViews) params.append("min_views", minViews);
                if (maxViews) params.append("max_views", maxViews);

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
                    toast.error("No article data available to export.");
                } else {
                    toast.error(errMsg);
                }

                return;
            }

            const blob = await res.blob();
            const contentDisposition = res.headers.get("Content-Disposition");
            let fileName = "articles_data.xlsx";

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

            toast.success("Articles data exported successfully.");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Export failed. Please try again.");
        }
    };

    const clearFilters = () => {
        setSelectedCategory([]);
        setStartDate("");
        setEndDate("");
        setAuthorFilter("");
        setMinViews("");
        setMaxViews("");
    };

    const hasFilters =
        (startDate && endDate) ||
        selectedCategory.length > 0 ||
        authorFilter ||
        minViews ||
        maxViews;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="relative bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
                    <h2 className="text-lg sm:text-xl font-bold mb-1">Export Articles Data</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Export comprehensive articles data including content, views, categories,
                        and author information.
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
                    {/* Date Range */}
                    <div>
                        <Label className="text-xs sm:text-sm mb-2 block font-semibold">Created Date Range</Label>
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

                    {/* Category Filter */}
                    <div>
                        <Label className="text-xs sm:text-sm block mb-2 font-semibold">Category</Label>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((c) => (
                                <div key={c.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`category-${c.value}`}
                                        checked={selectedCategory.includes(c.value)}
                                        onCheckedChange={() => toggleCategory(c.value)}
                                    />
                                    <Label htmlFor={`category-${c.value}`} className="text-xs sm:text-sm cursor-pointer">
                                        {c.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Author Filter */}
                    <div>
                        <Label htmlFor="authorFilter" className="text-xs sm:text-sm block mb-2 font-semibold">
                            Author Name (partial match)
                        </Label>
                        <Input
                            id="authorFilter"
                            type="text"
                            placeholder="Enter author name"
                            className="w-full text-sm"
                            value={authorFilter}
                            onChange={(e) => setAuthorFilter(e.target.value)}
                        />
                    </div>

                    {/* Views Range */}
                    <div>
                        <Label className="text-xs sm:text-sm mb-2 block font-semibold">Views Range</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <Label htmlFor="minViews" className="text-xs text-gray-500 mb-1">
                                    Min
                                </Label>
                                <Input
                                    id="minViews"
                                    type="number"
                                    placeholder="0"
                                    className="w-full text-sm"
                                    value={minViews}
                                    onChange={(e) => setMinViews(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="maxViews" className="text-xs text-gray-500 mb-1">
                                    Max
                                </Label>
                                <Input
                                    id="maxViews"
                                    type="number"
                                    placeholder="10000"
                                    className="w-full text-sm"
                                    value={maxViews}
                                    onChange={(e) => setMaxViews(e.target.value)}
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