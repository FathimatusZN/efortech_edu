import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ConfirmCertificateDialog = ({
    open,
    onClose,
    certificateId,
    certificate_number,
    original_number,
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
            // 1. First update status
            try {
                await onConfirm(certificateId, status, notes);
            } catch (err) {
                // If update fails, show error and stop
                setErrors((prev) => ({
                    ...prev,
                    general: err.message || "Failed to update certificate status",
                }));
                return; // STOP — don't continue to send email
            }

            // 2. If success, then send email
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Confirm Status Update</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2 w-full">
                        <table className="w-full text-sm mb-4">
                            <tbody>
                                <tr>
                                    <td className="pr-2 align-top text-gray-700 whitespace-nowrap font-semibold">Certificate ID</td>
                                    <td className="break-all whitespace-normal">{certificateId}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2 align-top text-gray-700 whitespace-nowrap font-semibold">Full Name</td>
                                    <td className="break-all whitespace-normal">{fullname}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2 align-top text-gray-700 whitespace-nowrap font-semibold">User ID</td>
                                    <td className="break-all whitespace-normal">{userId}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2 align-top text-gray-700 whitespace-nowrap font-semibold">Certificate Name</td>
                                    <td className="break-all whitespace-normal">{certName}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2 align-top text-gray-700 whitespace-nowrap font-semibold">Selected Status</td>
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

                    <div className="md:w-1/2 w-full flex flex-col">
                        <div className="flex justify-end mb-4">
                            <Button
                                onClick={fetchEmailPreview}
                                disabled={emailPreviewLoading}
                                className="bg-sky-600 text-white hover:bg-sky-700 w-full"
                            >
                                {emailPreviewLoading ? "Loading Preview..." : "Preview Email"}
                            </Button>
                        </div>

                        {errors.preview && (
                            <p className="text-red-500 text-sm mb-2">{errors.preview}</p>
                        )}

                        {emailPreviewHtml && (
                            <div
                                className="p-4 border rounded bg-gray-50 max-h-60 overflow-auto text-sm mb-4"
                                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
                            />
                        )}

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

                        {errors.general && (
                            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
