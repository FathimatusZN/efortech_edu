"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ExportNeedToProcessDialog({ open, onClose }) {
  const [dateType, setDateType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState("");
  const [trainingList, setTrainingList] = useState([]);

  const statuses = [
    { label: "Pending", value: "1" },
    { label: "Waiting", value: "2" },
    { label: "Validated", value: "3" },
  ];

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training`);
        const data = await res.json();
        setTrainingList(data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed");
      }
    };
    fetchTrainings();
  }, []);

  if (!open) return null;

  const toggleStatus = (value) => {
    setSelectedStatus((prev) =>
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

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/registrations/needprocess`;

    let res;
    if (type === "all") {
    // Untuk Export All, jangan kirim query apapun
      res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      const params = new URLSearchParams();
      params.append("tab", "needprocess");

      // ✅ Mapping dateType biar sesuai backend
      const mappedDateType =
        dateType === "registration" ? "registration_date" : "training_date";
      params.append("dateType", mappedDateType);

      if (startDate) params.append("start", `${startDate}T00:00:00Z`);
      if (endDate) params.append("end", `${endDate}T23:59:59Z`);
      if (selectedStatus.length > 0)
        params.append("statuses", selectedStatus.join(","));
      if (selectedTraining) params.append("training_id", selectedTraining);

      if (params.toString()) url += `?${params.toString()}`;

      res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    }

    if (!res.ok) {
  const errData = await res.json().catch(() => null);
  const errMsg = errData?.message || "Export failed.";

  // Kalau pesan dari backend "No data available to export"
  if (errMsg.toLowerCase().includes("no data")) {
    toast.error("No data available to export.");
  } else {
    toast.error(errMsg);
  }

  return;
}
    const blob = await res.blob();
    const contentDisposition = res.headers.get("Content-Disposition");
    let fileName = "exported_data.xlsx";

    // 📂 kalau backend kirim header "Content-Disposition: attachment; filename=xxx.xlsx"
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
      } catch (error) {
        console.error(error);
        toast.error("Export failed. Please try again.");
      }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white rounded-lg p-6 w-[460px] shadow-lg">
        <h2 className="text-xl font-bold mb-1">Export Need to Process</h2>
        <p className="text-sm text-gray-500 mb-4">
          Export training registration data that need to be processed.
        </p>

        {/* Date Type Selection */}
        <div className="mb-4">
          <Label className="text-sm block mb-2">Date Type</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
                <input
                type="radio"
                name="dateType"
                value="registration"
                checked={dateType === "registration"}
                onChange={(e) => setDateType(e.target.value)}
                />
                Registration Date
            </label>
            <label className="flex items-center gap-2">
                <input
                type="radio"
                name="dateType"
                value="training"
                checked={dateType === "training"}
                onChange={(e) => setDateType(e.target.value)}
                />
                Training Date
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

        {/* Status */}
        <div className="mb-4">
          <Label className="text-sm block mb-2">Status</Label>
          <div className="flex flex-wrap gap-3">
            {statuses.map((st) => (
              <div key={st.value} className="flex items-center space-x-2">
                <Checkbox
                  id={st.value}
                  checked={selectedStatus.includes(st.value)}
                  onCheckedChange={() => toggleStatus(st.value)}
                />
                <Label htmlFor={st.value} className="text-sm capitalize">
                  {st.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Training Dropdown */}
        <div className="mb-5">
          <Label className="text-sm block mb-2">Training</Label>
          <Select value={selectedTraining} onValueChange={setSelectedTraining}>
            <SelectTrigger className="w-full">
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

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button onClick={() => handleExport("all")} variant="mainBlue">
            Export All
          </Button>

          <Button
                variant="outline"
                onClick={() => {
                setSelectedTraining("");
                setSelectedStatus([]);
                setDateType("registration");
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
              selectedStatus.length > 0 ||
              selectedTraining
                ? "orange"
                : "outline"
            }
            disabled={
              !(
                (startDate && endDate) ||
                selectedStatus.length > 0 ||
                selectedTraining
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