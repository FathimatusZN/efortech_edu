// efortech_edu\src\components\layout\DocumentPreviewDialog.jsx
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export default function DocumentPreviewDialog({ open, onClose, document }) {
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset when dialog opens/closes
    useEffect(() => {
        if (open && document) {
            setLoading(true);
            setCurrentIndex(0);
        }
    }, [open, document]);

    if (!document) return null;

    const isMultiple = document.isMultiple && Array.isArray(document.urls);
    const documentUrls = isMultiple ? document.urls : [document.url];
    const currentUrl = documentUrls[currentIndex];
    const isPDF = currentUrl?.toLowerCase().endsWith(".pdf");

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : documentUrls.length - 1));
        setLoading(true);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < documentUrls.length - 1 ? prev + 1 : 0));
        setLoading(true);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-4 sm:p-6 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-lg sm:text-xl truncate">
                                {document.title}
                                {isMultiple && ` (${currentIndex + 1}/${documentUrls.length})`}
                            </DialogTitle>
                        </div>
                        <a
                            href={currentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-mainBlue hover:text-lightBlue transition whitespace-nowrap"
                        >
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Open in New Tab</span>
                            <span className="sm:hidden">Open</span>
                        </a>
                    </div>
                </DialogHeader>

                <div className="relative">
                    {/* Loading overlay */}
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                            <LoadingSpinner />
                        </div>
                    )}

                    {/* Document preview */}
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="border border-neutral2 rounded-lg overflow-hidden bg-neutral1">
                            {isPDF ? (
                                <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                                        currentUrl
                                    )}&embedded=true`}
                                    className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
                                    title={`${document.title} - File ${currentIndex + 1}`}
                                    onLoad={() => setLoading(false)}
                                />
                            ) : (
                                <img
                                    src={currentUrl}
                                    alt={`${document.title} - File ${currentIndex + 1}`}
                                    className="w-full h-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-contain"
                                    onLoad={() => setLoading(false)}
                                    onError={() => setLoading(false)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Navigation buttons for multiple documents */}
                    {isMultiple && documentUrls.length > 1 && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex items-center justify-center gap-3 sm:gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevious}
                                className="flex items-center gap-2 text-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </Button>
                            <span className="text-sm text-neutral3 whitespace-nowrap">
                                {currentIndex + 1} / {documentUrls.length}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNext}
                                className="flex items-center gap-2 text-sm"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {/* File list for multiple documents */}
                    {isMultiple && documentUrls.length > 1 && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <p className="text-sm font-medium text-neutral3 mb-2">
                                All Files ({documentUrls.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {documentUrls.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setLoading(true);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition text-sm ${currentIndex === index
                                                ? "border-mainBlue bg-blue-50 text-mainBlue"
                                                : "border-neutral2 bg-white hover:border-neutral3"
                                            }`}
                                    >
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <span>File {index + 1}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}