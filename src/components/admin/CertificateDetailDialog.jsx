"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleString("en-US", options).replace(",", ",");
};

const CertificateDetailDialog = ({ open, onClose, data }) => {
    const [isPreviewLoading, setIsPreviewLoading] = useState(true);
    const isPDF = data.cert_file?.endsWith(".pdf");

    // Reset loading state setiap kali file berubah atau dialog dibuka
    useEffect(() => {
        if (open && data.cert_file) {
            setIsPreviewLoading(true);
        }
    }, [open, data.cert_file]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-md">
                <DialogHeader>
                    <DialogTitle>Certificate Detail</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-y-2 text-sm">
                        <InfoRow label="Certificate Number" value={data.certificate_number} />
                        <InfoRow label="Certificate ID" value={data.certificate_id} />
                        <InfoRow label="Issued Date" value={formatDate(data.issued_date)} />
                        <InfoRow label="Expired Date" value={formatDate(data.expired_date)} />
                        <InfoRow label="Validity Status" value={data.status_certificate} />
                        <InfoRow label="Training" value={data.training_name} />
                        <InfoRow label="Participant" value={data.fullname} />
                    </div>

                    {data.cert_file && (
                        <div className="w-full relative">
                            <p className="text-sm font-medium mb-2">Certificate Preview</p>

                            {isPreviewLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded border">
                                    <LoadingSpinner size="lg" />
                                </div>
                            )}

                            {isPDF ? (
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${data.cert_file}&embedded=true`}
                                    className="w-full h-[300px] rounded border relative z-0"
                                    onLoad={() => setIsPreviewLoading(false)}
                                />
                            ) : (
                                <img
                                    src={data.cert_file}
                                    alt="Certificate"
                                    className="w-full max-h-[300px] object-contain rounded border relative z-0"
                                    onLoad={() => setIsPreviewLoading(false)}
                                    onError={() => setIsPreviewLoading(false)}
                                />
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4">
                    <Button onClick={onClose} className="bg-mainOrange text-white">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
        <div className="font-semibold min-w-[150px]">{label}</div>
        <div className="flex-1 break-words">{value || "-"}</div>
    </div>
);

export default CertificateDetailDialog;
