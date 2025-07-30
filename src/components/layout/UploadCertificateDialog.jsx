"use client";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UploadCertificateDialog({
  open,
  onOpenChange,
  registrationParticipantId,
  registrationId,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setFileUrl(null);

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("registration_id", registrationId);

    try {
      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/upload-advantech-certificate`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (
        !uploadRes.ok ||
        uploadData.status !== "success" ||
        !uploadData.data?.fileUrl
      ) {
        toast.error(uploadData.message || "Upload failed.");
        setFile(null);
        return;
      }

      setFileUrl(uploadData.data.fileUrl);
      setIsPreviewLoading(true);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Something went wrong while uploading the file.");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      toast.error("File URL is not set. Please upload a file first.");
      return;
    }

    try {
      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/update-advantech-link`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registration_participant_id: registrationParticipantId,
            fileUrl,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        toast.error(updateData.message || "Failed to save certificate.");
        return;
      }

      onSuccess?.();
      onOpenChange(false);
      toast.success("Certificate uploaded successfully.");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to save certificate. Please try again.");
    }
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setFileUrl(null);
      setIsConfirmed(false);
      setIsUploading(false);
      setIsPreviewLoading(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto w-[95vw] sm:w-[90vw] p-4 sm:p-6 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">
            Upload Advantech Certificate
          </DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="mt-2 w-full text-sm"
        />

        {fileUrl && (
          <>
            <div className="relative mt-4 w-full max-h-[60vh]">
              {isPreviewLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                  <LoadingSpinner className="w-10 h-10" />
                </div>
              )}
              <iframe
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`}
                title="Certificate Preview"
                className="w-full h-full min-h-[300px] border rounded"
                onLoad={() => setIsPreviewLoading(false)}
              />
            </div>

            {/* Checkbox warning */}
            <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-md">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="confirmUpload"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 shrink-0"
                />
                <label
                  htmlFor="confirmUpload"
                  className="leading-snug italic break-words flex-1"
                >
                  I confirm that the uploaded certificate is correct. I understand that this file can only be uploaded once and cannot be changed later.
                </label>
              </div>
            </div>

          </>
        )}

        <Button
          className="mt-4 w-full bg-mainOrange text-white text-sm sm:text-base"
          onClick={handleSubmit}
          disabled={!fileUrl || !isConfirmed}
        >
          Save Certificate
        </Button>
      </DialogContent>
    </Dialog>
  );
}
