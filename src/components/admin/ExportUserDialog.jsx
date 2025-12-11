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
  const [selectedRoles, setSelectedRoles] = useState([]); // for role_id
  const [selectedUserRoles, setSelectedUserRoles] = useState([]); // for role (numeric + NULL)

  const roles = [
    { label: "user", value: "role1" },
    { label: "admin", value: "role2" },
    { label: "superadmin", value: "role3" },
  ];

  const userRoles = [
    { label: "NULL", value: "NULL" },
    { label: "Teacher / Lecturer", value: "1" },
    { label: "Student", value: "2" },
    { label: "University Student", value: "3" },
    { label: "Professional", value: "4" },
    { label: "Others", value: "5" },
  ];

  if (!open) return null;

  const toggleRole = (value) => {
    setSelectedRoles((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const toggleUserRole = (value) => {
    setSelectedUserRoles((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
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

      if (selectedUserRoles.length > 0) {
        // mapping: frontend "NULL" -> backend "others"
        const roleParams = selectedUserRoles.map((r) => {
          if (r === "NULL") return "others";
          return r;
        });
        params.append("role", roleParams.join(","));
      }

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Export URL:", url);


      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Export failed. Please try again.");
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "user_data.xlsx";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
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
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(err.message || "Export failed. Please try again.");
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedRoles([]);
    setSelectedUserRoles([]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white rounded-lg p-6 w-[480px] shadow-lg">
        <h2 className="text-xl font-bold mb-2">Export User Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select the date range (user registration date) and roles you want to export.
        </p>

        {/* Date Range */}
        <div className="mb-4">
          <Label className="text-sm mb-2 block font-bold">Date Range</Label>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <Label htmlFor="startDate" className="text-xs text-gray-500 mb-1 font-semibold">From</Label>
              <Input
                id="startDate"
                type="date"
                className="w-50"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="endDate" className="text-xs text-gray-500 mb-1 font-semibold">To</Label>
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

        {/* Roles (role_id) */}
        <div className="mb-5">
          <Label className="text-sm block mb-1 font-bold">Roles (system roles)</Label>
          <p className="text-xs text-gray-500 mb-2">Filter by system-defined role</p>
          <div className="flex flex-wrap gap-3">
            {roles.map((role) => (
              <div key={role.value} className="flex items-center space-x-2">
                <Checkbox
                  id={role.value}
                  checked={selectedRoles.includes(role.value)}
                  onCheckedChange={() => toggleRole(role.value)}
                />
                <Label htmlFor={role.value} className="text-sm capitalize">{role.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* User Roles (numeric + NULL) */}
        <div className="mb-5">
          <Label className="text-sm block mb-1 font-bold">User Roles</Label>
          <p className="text-xs text-gray-500 mb-2">Filter by job role or NULL</p>
          <div className="flex flex-wrap gap-3">
            {userRoles.map((r) => (
              <div key={r.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`userRole-${r.value}`}
                  checked={selectedUserRoles.includes(r.value)}
                  onCheckedChange={() => toggleUserRole(r.value)}
                />
                <Label htmlFor={`userRole-${r.value}`} className="text-sm">{r.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <Button onClick={() => handleExport("all")} variant="mainBlue">Export All</Button>

          <Button
            variant="outline"
            onClick={clearFilters}
          >
            Clear Filter
          </Button>

          <Button
            onClick={() => handleExport("custom")}
            variant={(startDate && endDate) || selectedRoles.length > 0 || selectedUserRoles.length > 0 ? "orange" : "outline"}
            disabled={!((startDate && endDate) || selectedRoles.length > 0 || selectedUserRoles.length > 0)}
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
