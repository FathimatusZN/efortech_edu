// efortech_edu\src\components\admin\ExportUserDialog.jsx
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
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);

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

  const hasFilters =
    (startDate && endDate) ||
    selectedRoles.length > 0 ||
    selectedUserRoles.length > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="relative bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Export User Data</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Select the date range (user registration date) and roles you want to export.
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

          {/* Roles (role_id) */}
          <div>
            <Label className="text-xs sm:text-sm block mb-1 font-semibold">
              Roles (system roles)
            </Label>
            <p className="text-xs text-gray-500 mb-2">Filter by system-defined role</p>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={() => toggleRole(role.value)}
                  />
                  <Label htmlFor={role.value} className="text-xs sm:text-sm capitalize cursor-pointer">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* User Roles (numeric + NULL) */}
          <div>
            <Label className="text-xs sm:text-sm block mb-1 font-semibold">User Roles</Label>
            <p className="text-xs text-gray-500 mb-2">Filter by job role or NULL</p>
            <div className="flex flex-wrap gap-3">
              {userRoles.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`userRole-${r.value}`}
                    checked={selectedUserRoles.includes(r.value)}
                    onCheckedChange={() => toggleUserRole(r.value)}
                  />
                  <Label htmlFor={`userRole-${r.value}`} className="text-xs sm:text-sm cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
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