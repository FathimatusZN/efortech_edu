import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutlineFilePdf, AiOutlineFileImage, AiOutlineFileUnknown } from "react-icons/ai";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export function UploadCertificateDialog({
    open,
    setOpen,
    participant,
    onShowSuccess,
}) {
    const [certificateNumber, setCertificateNumber] = useState("");
    const [issuedDate, setIssuedDate] = useState("");
    const [expiredDate, setExpiredDate] = useState("");
    const [certFile, setCertFile] = useState(null);
    const [certPreviewUrl, setCertPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [emailPreviewHtml, setEmailPreviewHtml] = useState("");
    const [emailPreviewLoading, setEmailPreviewLoading] = useState(false);
    const [emailPreviewFetched, setEmailPreviewFetched] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const resetForm = () => {
        setCertificateNumber("");
        setIssuedDate("");
        setExpiredDate("");
        setCertFile(null);
        setCertPreviewUrl("");
        setErrors({});
        setEmailPreviewHtml("");
        setEmailPreviewFetched(false);
    };

    useEffect(() => {
        if (!open) resetForm();
    }, [open]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCertFile(null);
            setCertPreviewUrl("");
            if (file.type === "application/pdf") {
                setPdfLoading(true);
            }
            try {
                const url = await uploadFile(file);
                setCertFile(file);
                setCertPreviewUrl(url);
                setErrors((prev) => ({ ...prev, certFile: null }));
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    certFile: error.message || "Failed to upload file. Please try again.",
                }));
                setPdfLoading(false);
            }
        }
    };

    const uploadFile = async (file) => {
        const allowedTypes = [
            "image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic", "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error("Only image or PDF files are allowed.");
        }

        const formData = new FormData();
        formData.append("files", file);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/upload-certificate`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();

        if (!res.ok || data.status !== "success") {
            throw new Error(data.message || "File upload failed");
        }

        return data.data.fileUrl;
    };

    const isFormValid =
        issuedDate.trim() &&
        certPreviewUrl;

    // Tombol preview cuma aktif kalau data lengkap dan ga loading preview
    const canPreviewEmail = isFormValid && !emailPreviewLoading;

    // Tombol save aktif kalau sudah valid dan preview email sudah didapat
    const canSave = isFormValid && emailPreviewFetched && !saving;

    const fetchEmailPreview = async () => {
        if (!canPreviewEmail) return;

        setEmailPreviewLoading(true);
        setErrors((prev) => ({ ...prev, preview: null }));
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/email/preview-training-certificate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registration_participant_id: participant.registration_participant_id,
                    issued_date: issuedDate,
                    expired_date: expiredDate,
                    certificate_number: participant.certificate_number,
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

    const handleSubmit = async () => {
        setSaving(true);
        setErrors({});

        if (!canSave) {
            setErrors({
                general: "Please fill all data and preview email before saving.",
            });
            setSaving(false);
            return;
        }

        try {
            const body = {
                certificate_id: participant.certificate_id,
                issued_date: issuedDate,
                expired_date: expiredDate,
                cert_file: certPreviewUrl,
                registration_participant_id: participant.registration_participant_id,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "API error");
            }

            // Setelah save, kirim email
            const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/email/send-training-certificate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    certificate_number: participant.certificate_number
                }),
            });

            const emailData = await emailResponse.json();
            if (!emailResponse.ok) throw new Error(emailData.message);

            onShowSuccess?.();
            setOpen(false);
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                general: err.message || "Failed to save certificate",
            }));
        } finally {
            setSaving(false);
        }
    };

    const renderFileIcon = () => {
        if (!certFile) return <AiOutlineFileUnknown className="text-gray-500 w-5 h-5" />;
        if (certFile.type === "application/pdf")
            return <AiOutlineFilePdf className="text-red-500 w-5 h-5" />;
        if (certFile.type.startsWith("image/"))
            return <AiOutlineFileImage className="text-green-500 w-5 h-5" />;
        return <AiOutlineFileUnknown className="text-gray-500 w-5 h-5" />;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-[95vw] max-h-[95vh] px-4 py-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>Upload Certificate</DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-12 max-h-[80vh] overflow-auto px-1">
                    <div className="space-y-2">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Participant ID</Label>
                                <Input value={participant?.registration_participant_id || ""} disabled />
                            </div>

                            <div className="flex-1">
                                <Label>Certificate Number</Label>
                                <Input value={participant?.certificate_number || ""} disabled />
                                {errors.certificateNumber && (
                                    <p className="text-red-500 text-sm">{errors.certificateNumber}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Full Name</Label>
                                <Input value={participant?.fullname || ""} disabled />
                            </div>
                            <div className="flex-1">
                                <Label>Email</Label>
                                <Input value={participant?.email || ""} disabled />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Issued Date <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={issuedDate}
                                    onChange={(e) => setIssuedDate(e.target.value)}
                                />
                                {errors.issuedDate && (
                                    <p className="text-red-500 text-sm">{errors.issuedDate}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <Label>Expired Date</Label>
                                <Input
                                    type="date"
                                    value={expiredDate}
                                    onChange={(e) => setExpiredDate(e.target.value)}
                                />
                                <p className="text-gray-500 text-xs">Leave empty if no expiry date</p>
                                {errors.expiredDate && (
                                    <p className="text-red-500 text-sm">{errors.expiredDate}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Certificate File <span className="text-red-500">*</span></Label>
                            <Input type="file" onChange={handleFileChange} />
                            {errors.certFile && (
                                <p className="text-red-500 text-sm">{errors.certFile}</p>
                            )}
                        </div>

                        {certFile && certPreviewUrl && (
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    {renderFileIcon()}
                                    <a
                                        href={certPreviewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-sm break-all"
                                    >
                                        {certFile.name}
                                    </a>
                                </div>

                                {certFile.type.startsWith("image/") ? (
                                    <img
                                        src={certPreviewUrl}
                                        alt="Certificate Preview"
                                        className="w-full max-h-60 object-contain border rounded"
                                    />
                                ) : certFile.type === "application/pdf" ? (
                                    <div className="relative w-full h-60 border rounded">
                                        {pdfLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                                                <span className="justify-center item-center"><LoadingSpinner /></span>
                                            </div>
                                        )}
                                        <iframe
                                            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(certPreviewUrl)}`}
                                            title="Certificate File"
                                            className="w-full h-full"
                                            onLoad={() => setPdfLoading(false)}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm italic">
                                        File preview not supported. Click the link to view.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={fetchEmailPreview}
                            disabled={!canPreviewEmail}
                            className="w-full bg-lightBlue text-white hover:bg-mainBlue"
                        >
                            {emailPreviewLoading ? "Loading Preview..." : "Preview Email"}
                        </Button>

                        {errors.preview && (
                            <p className="text-red-500 text-sm">{errors.preview}</p>
                        )}

                        {emailPreviewHtml ? (
                            <div
                                className="mt-4 p-4 border rounded bg-gray-50 overflow-auto max-h-[60vh] text-sm"
                                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
                            />
                        ) : (
                            <p className="text-gray-500 mt-4 italic text-sm">
                                Email preview will show here after you click Preview Email.
                            </p>
                        )}

                        {errors.general && (
                            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={!canSave}
                            className="w-full bg-mainBlue text-white hover:bg-lightBlue 700 mt-4"
                        >
                            {saving ? "Saving..." : "Save & Send Email"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
