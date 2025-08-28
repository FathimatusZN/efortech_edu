"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { AiOutlineFilePdf, AiOutlineFileImage, AiOutlineFileUnknown } from "react-icons/ai";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditCertificateDialog({ open, setOpen, certificate, onShowSuccess }) {
    const [issuedDate, setIssuedDate] = useState("");
    const [expiredDate, setExpiredDate] = useState("");
    const [certFile, setCertFile] = useState(null);
    const [certPreviewUrl, setCertPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        if (certificate && open) {
            setIssuedDate(certificate.issued_date?.split("T")[0] || "");
            setExpiredDate(certificate.expired_date?.split("T")[0] || "");
            setCertPreviewUrl(certificate.cert_file || "");
            setCertFile({ name: "Existing File", type: "existing" });
        }
    }, [certificate, open]);


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCertFile(null);
            setCertPreviewUrl("");
            if (file.type === "application/pdf") setPdfLoading(true);

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
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
            "image/heic",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Only image or PDF files are allowed.");
        }

        const formData = new FormData();
        formData.append("files", file);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/upload-certificate`,
            { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!res.ok || data.status !== "success") {
            throw new Error(data.message || "File upload failed");
        }
        return data.data.fileUrl;
    };

    const handleSubmit = async () => {
        setSaving(true);
        setErrors({});
        try {
            const body = {
                certificate_id: certificate.certificate_id,
                issued_date: issuedDate,
                expired_date: expiredDate,
                cert_file: certFile?.type === "existing" ? "" : certPreviewUrl,
                registration_participant_id: certificate.registration_participant_id,
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/update`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Update failed");
            }

            onShowSuccess?.(); // callback success
            setOpen(false);
        } catch (err) {
            setErrors((prev) => ({ ...prev, general: err.message }));
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
            <DialogContent className="w-full max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-md">
                <DialogHeader>
                    <DialogTitle>Edit Certificate</DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* LEFT SIDE: STATIC INFO */}
                    <div className="space-y-3">
                        <div>
                            <Label>Certificate Number</Label>
                            <Input value={certificate?.certificate_number || ""} disabled />
                        </div>
                        <div>
                            <Label>Certificate ID</Label>
                            <Input value={certificate?.certificate_id || ""} disabled />
                        </div>
                        <div>
                            <Label>Training</Label>
                            <Input value={certificate?.training_name || ""} disabled />
                        </div>
                        <div>
                            <Label>Participant</Label>
                            <Input value={certificate?.fullname || ""} disabled />
                        </div>
                    </div>

                    {/* RIGHT SIDE: EDITABLE FIELDS */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Issued Date *</Label>
                                <Input
                                    type="date"
                                    value={issuedDate}
                                    onChange={(e) => setIssuedDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Label>Expired Date</Label>
                                <Input
                                    type="date"
                                    value={expiredDate}
                                    onChange={(e) => setExpiredDate(e.target.value)}
                                />
                                <p className="text-xs text-gray-500">Leave empty if no expiry</p>
                            </div>
                        </div>

                        <div>
                            <Label>Certificate File</Label>
                            <Input type="file" onChange={handleFileChange} />
                            {errors.certFile && <p className="text-red-500 text-sm">{errors.certFile}</p>}
                        </div>

                        {certPreviewUrl && (
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    {renderFileIcon()}
                                    <a
                                        href={certPreviewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-sm break-all"
                                    >
                                        {certFile?.name || "View uploaded file"}
                                    </a>
                                </div>

                                {certFile?.type?.startsWith("image/") ? (
                                    <img
                                        src={certPreviewUrl}
                                        alt="Certificate Preview"
                                        className="w-full max-h-60 object-contain border rounded"
                                    />
                                ) : certFile?.type === "application/pdf" || certPreviewUrl.endsWith(".pdf") ? (
                                    <div className="relative w-full h-60 border rounded">
                                        {pdfLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                                                <LoadingSpinner />
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

                        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

                        <Button
                            onClick={handleSubmit}
                            disabled={saving || !issuedDate}
                            className="bg-mainBlue text-white w-full"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
