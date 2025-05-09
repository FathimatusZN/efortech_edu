import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const ConfirmCertificateDialog = ({
    open,
    onClose,
    certificateId,
    fullname,
    userId,
    certName,
    status,
    onConfirm,
}) => {
    const [notes, setNotes] = useState("");

    const handleConfirm = () => {
        onConfirm(certificateId, status, notes);
        onClose();
    };

    if (!open) return null;

    const statusText = status === 2 ? "Accepted" : "Rejected";
    const statusColor = status === 2 ? "text-green-600" : "text-red-600";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Confirm Status Update</h2>

                <table className="w-full text-sm mb-4">
                    <tbody>
                        <tr>
                            <td className="pr-2 align-top text-gray-700 font-medium whitespace-nowrap">Certificate ID</td>
                            <td>: </td>
                            <td>{certificateId}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 align-top text-gray-700 font-medium whitespace-nowrap">Full Name</td>
                            <td>: </td>
                            <td>{fullname}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 align-top text-gray-700 font-medium whitespace-nowrap">User ID</td>
                            <td>: </td>
                            <td>{userId}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 align-top text-gray-700 font-medium whitespace-nowrap">Certificate Name</td>
                            <td>: </td>
                            <td>{certName}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 align-top text-gray-700 font-medium whitespace-nowrap">Selected Status</td>
                            <td>: </td>
                            <td className={`font-bold ${statusColor}`}>{statusText}</td>
                        </tr>
                    </tbody>
                </table>

                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 mb-4"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className={status === 2 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};
