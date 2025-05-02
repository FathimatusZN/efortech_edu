// efortech_edu/src/components/admin/UploadCertificateDialog.jsx

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

export function UploadCertificateDialog({
    open,
    setOpen,
    participant,
    onUploadFile,
    onSave,
    onShowSuccess,
}) {
    const [certificateNumber, setCertificateNumber] = useState("");
    const [issuedDate, setIssuedDate] = useState("");
    const [expiredDate, setExpiredDate] = useState("");
    const [certFile, setCertFile] = useState(null);
    const [certPreviewUrl, setCertPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setCertificateNumber("");
        setIssuedDate("");
        setExpiredDate("");
        setCertFile(null);
        setCertPreviewUrl("");
        setErrors({});
    };

    useEffect(() => {
        if (!open) resetForm();
    }, [open]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCertFile(null);
            setCertPreviewUrl("");
            try {
                const url = await onUploadFile(file); // file upload async
                setCertFile(file);
                setCertPreviewUrl(url);
                setErrors((prev) => ({ ...prev, certFile: null }));
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    certFile: error.message || "Failed to upload file. Please try again.",
                }));
            }
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setErrors({});

        if (!certificateNumber || !issuedDate || !expiredDate || !certPreviewUrl) {
            setErrors({
                certificateNumber: !certificateNumber && "Certificate number is required",
                issuedDate: !issuedDate && "Issued date is required",
                expiredDate: !expiredDate && "Expired date is required",
                certFile: !certPreviewUrl && "Certificate file is required",
            });
            setSaving(false);
            return;
        }

        try {
            await onSave({
                registration_participant_id: participant.registration_participant_id,
                certificate_number: certificateNumber,
                issued_date: issuedDate,
                expired_date: expiredDate,
                cert_file_url: certPreviewUrl,
            });
            setOpen(false);
            resetForm();
            onShowSuccess();
        } catch (err) {
            setErrors({ submit: "Failed to save certificate. Try again." });
        } finally {
            setSaving(false);
        }
    };

    const isFormValid =
        certificateNumber && issuedDate && expiredDate && certPreviewUrl;

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
            <DialogContent className="max-w-4xl px-4 py-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle>Upload Certificate</DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 mt-4 max-h-[80vh] overflow-auto px-1">
                    {/* Left - Form */}
                    <div className="space-y-4">
                        <div>
                            <Label>Participant ID</Label>
                            <Input value={participant?.registration_participant_id || ""} disabled />
                        </div>
                        <div>
                            <Label>Full Name</Label>
                            <Input value={participant?.fullname || ""} disabled />
                        </div>
                        <div>
                            <Label>Certificate Number</Label>
                            <Input
                                value={certificateNumber}
                                onChange={(e) => setCertificateNumber(e.target.value)}
                                placeholder="CERT-2025-XXXX"
                            />
                            {errors.certificateNumber && (
                                <p className="text-red-500 text-sm">{errors.certificateNumber}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Issued Date</Label>
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
                                {errors.expiredDate && (
                                    <p className="text-red-500 text-sm">{errors.expiredDate}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right - File & Save */}
                    <div className="space-y-4">
                        <div>
                            <Label>Certificate File</Label>
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
                                        className="text-blue-600 underline text-sm"
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
                                    <embed
                                        src={certPreviewUrl}
                                        type="application/pdf"
                                        className="w-full h-60 border rounded"
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm italic">
                                        File preview not supported. Click the link to view.
                                    </p>
                                )}
                            </div>
                        )}

                        {errors.submit && (
                            <p className="text-red-500 text-sm">{errors.submit}</p>
                        )}

                        <Button
                            className="w-full mt-4 bg-mainBlue text-white hover:bg-blue-700"
                            onClick={handleSubmit}
                            disabled={!isFormValid || saving}
                        >
                            {saving ? "Saving..." : "Save Certificate"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
