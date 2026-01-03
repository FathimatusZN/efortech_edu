"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DetailUserDialog({ open, setOpen, user }) {
    if (!user) return null;

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

    const roleMapping = {
        1: "Teacher / Lecturer",
        2: "Student",
        3: "University Student",
        4: "Professional",
        5: "Others",
    };

    const rows = [
        { label: "Email", value: user.email },
        { label: "Phone Number", value: user.phone_number || "-" },
        { label: "Institution", value: user.institution || "-" },
        { label: "Role", value: roleMapping[user.role] || "-" },
        { label: "Position", value: user.position || "-" },
        { label: "Gender", value: user.gender === 1 ? "Male" : user.gender === 2 ? "Female" : "-" },
        { label: "Birthdate", value: formatDate(user.birthdate) },
        { label: "Created Date", value: formatDate(user.created_at) },
        { label: "Last Login", value: user.last_login || "-" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] max-w-[90vw] overflow-y-auto overflow-x-auto p-6 rounded-xl"
            >
                <DialogHeader className="text-center">
                    <DialogTitle>User Detail</DialogTitle>
                </DialogHeader>

                {/* Profile Section */}
                <div className="flex flex-col items-center gap-3 py-4 border-b">
                    <img
                        src={user.user_photo || "assets/user1.png"}
                        alt={user.fullname}
                        className="w-24 h-24 rounded-full object-cover shadow"
                    />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{user.fullname}</h3>
                        <p className="text-sm text-gray-500">{user.role_name}</p>
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
