"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function TrainingPage() {
  return (
    <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-orange-600">Halaman Artikel</h1>
        <p className="mt-4">Ini adalah halaman Artikel User.</p>
      </div>
    </ProtectedRoute>
  );
}  