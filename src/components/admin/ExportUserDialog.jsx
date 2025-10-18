"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase/config";
import { getIdToken } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ExportUserDialog({ open, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const roles = [
    { label: "user", value: "role1" },
    { label: "admin", value: "role2" },
    { label: "superadmin", value: "role3" },
  ];

  if (!open) return null;

  const toggleRole = (value) => {
    setSelectedRoles((prev) =>
      prev.includes(value)
        ? prev.filter((r) => r !== value)
        : [...prev, value]
    );
  };

  const handleExport = async (type) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not logged in");
      const token = await getIdToken(currentUser);

      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/users`;
      const params = new URLSearchParams();

      if (type === "custom") {
        if (startDate) params.append("start", `${startDate}T00:00:00Z`);
        if (endDate) params.append("end", `${endDate}T23:59:59Z`);
      }

      if (selectedRoles.length > 0) {
        params.append("roles", selectedRoles.join(","));
      }

      if (params.toString()) url += `?${params.toString()}`;

      console.log("Export URL:", url);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Export response:", res.status);

      if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const errMsg = errData?.message || "Export failed. Please try again.";
      toast.error(errMsg);
      return;
    }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "user_data.xlsx";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);

      toast.success("User data exported successfully.");
      onClose();

        } catch (error) {
      console.error("Export failed:", error);
      toast.error(error.message  || "Export failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white rounded-lg p-6 w-[420px] shadow-lg">
        <h2 className="text-xl font-bold mb-2">Export User Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select the date range and user roles you want to export to an Excel file
        </p>

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
                className="w-50"
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
                className="w-50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <Label className="text-sm block mb-2">Roles</Label>
          <div className="flex flex-wrap gap-3">
            {roles.map((role) => (
            <div key={role.value} className="flex items-center space-x-2">
              <Checkbox
                id={role.value}
                checked={selectedRoles.includes(role.value)}
                onCheckedChange={() => toggleRole(role.value)}
              />
              <Label htmlFor={role.value} className="text-sm capitalize">
                {role.label}
              </Label>
            </div>
          ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => handleExport("all")}
            variant="mainBlue"
          >
            Export All
          </Button>

          <Button
            onClick={() => handleExport("custom")}
            variant={
              (startDate && endDate) || selectedRoles.length > 0
                ? "orange"
                : "outline"
            }
            disabled={!((startDate && endDate) || selectedRoles.length > 0)}
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
