import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ConfirmCertificateDialog = ({
    open,
    onClose,
    certificateId,
    certificate_number,
    fullname,
    userId,
    certName,
    status,
    onConfirm,
}) => {
    const [notes, setNotes] = useState("");
    const [emailPreviewHtml, setEmailPreviewHtml] = useState("");
    const [emailPreviewLoading, setEmailPreviewLoading] = useState(false);
    const [emailPreviewFetched, setEmailPreviewFetched] = useState(false);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleConfirm = async () => {
        if (!emailPreviewFetched) {
            setErrors((prev) => ({
                ...prev,
                general: "Please preview email before confirming.",
            }));
            return;
        }

        setSaving(true);
        setErrors({});

        try {
            // 1. Send Email
            const emailRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/email/send-upload-certificate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_certificate_id: certificateId,
                    certificate_number: certificate_number,
                    status,
                    notes,
                }),
            });

            const emailData = await emailRes.json();
            if (!emailRes.ok) throw new Error(emailData.message);

            // 2. Callback update status
            await onConfirm(certificateId, status, notes);

            onClose();
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                general: err.message || "Failed to confirm and send email",
            }));
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!open) {
            setNotes("");
            setEmailPreviewHtml("");
            setEmailPreviewFetched(false);
            setEmailPreviewLoading(false);
            setErrors({});
            setSaving(false);
        }
    }, [open]);

    if (!open) return null;

    const statusText = status === 2 ? "Accepted" : "Rejected";
    const statusColor = status === 2 ? "text-green-600" : "text-red-600";

    const fetchEmailPreview = async () => {
        setEmailPreviewLoading(true);
        setErrors((prev) => ({ ...prev, preview: null }));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/email/preview-upload-certificate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_certificate_id: certificateId,
                    certificate_number: certificate_number,
                    status,
                    notes,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setEmailPreviewHtml(data.data.html);
            setEmailPreviewFetched(true);
        } catch (err) {
            setErrors((prev) => ({ ...prev, preview: err.message }));
            setEmailPreviewHtml("");
            setEmailPreviewFetched(false);
        } finally {
            setEmailPreviewLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-4xl">
                <h2 className="text-lg font-semibold mb-4">Confirm Status Update</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left : Information and input field */}
                    <div className="md:w-1/2 w-full">
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
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Right : Button & Preview Email */}
                    <div className="md:w-1/2 w-full flex flex-col">
                        {/* Preview Email Button */}
                        <div className="flex justify-end mb-4">
                            <Button
                                onClick={fetchEmailPreview}
                                disabled={emailPreviewLoading}
                                className="bg-sky-600 text-white hover:bg-sky-700 w-full"
                            >
                                {emailPreviewLoading ? "Loading Preview..." : "Preview Email"}
                            </Button>
                        </div>

                        {/* Error preview */}
                        {errors.preview && (
                            <p className="text-red-500 text-sm mb-2">{errors.preview}</p>
                        )}

                        {/* Preview Email */}
                        {emailPreviewHtml && (
                            <div
                                className="p-4 border rounded bg-gray-50 max-h-60 overflow-auto text-sm mb-4"
                                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
                            />
                        )}

                        {/* Tombol Cancel & Send */}
                        <div className="flex justify-end gap-2 mt-auto">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={saving || !emailPreviewFetched}
                                className={status === 2
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"}
                            >
                                {saving ? "Sending..." : "Send & Confirm"}
                            </Button>
                        </div>

                        {/* General error */}
                        {errors.general && (
                            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
