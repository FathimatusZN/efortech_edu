"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DetailAdminDialog({ open, setOpen, admin }) {
    if (!admin) return null;

    // Format tanggal lahir
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-UK", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const rows = [
        { label: "Email", value: admin.email },
        { label: "Phone Number", value: admin.phone_number || "-" },
        { label: "Institution", value: admin.institution || "-" },
        { label: "Gender", value: admin.gender === 1 ? "Male" : admin.gender === 2 ? "Female" : "-" },
        { label: "Birthdate", value: formatDate(admin.birthdate) },
        { label: "Status", value: admin.status },
        { label: "Created Date", value: formatDate(admin.created_date) },
        { label: "Last Updated", value: admin.last_updated || "-" },
        { label: "Last Login", value: admin.last_login || "-" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] max-w-[90vw] overflow-y-auto overflow-x-auto p-6 rounded-xl"
            >
                <DialogHeader className="text-center">
                    <DialogTitle>Admin Detail</DialogTitle>
                </DialogHeader>

                {/* Profile Section */}
                <div className="flex flex-col items-center gap-3 py-4 border-b">
                    <img
                        src={admin.user_photo || "assets/user1.png"}
                        alt={admin.fullname}
                        className="w-24 h-24 rounded-full object-cover shadow"
                    />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{admin.fullname}</h3>
                        <p className="text-sm text-gray-500">{admin.role_name}</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="divide-y text-sm">
                    {rows.map((r, i) => (
                        <div key={i} className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">{r.label}</span>
                            <span
                                className={`${r.label === "Status"
                                    ? r.value === "Active"
                                        ? "text-green-600 font-medium"
                                        : "text-red-500 font-medium"
                                    : "text-gray-900"
                                    }`}
                            >
                                {r.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
