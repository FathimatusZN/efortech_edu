"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { X, FileText, Upload } from "lucide-react";

export default function UploadCertificateDialog({
  open,
  onOpenChange,
  registrationParticipantId,
  registrationId,
  onSuccess,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate: only PDF
    const invalidFiles = files.filter((f) => f.type !== "application/pdf");
    if (invalidFiles.length > 0) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    // Validate: max 3 files total
    if (selectedFiles.length + files.length > 3) {
      toast.error("Maximum 3 certificate files allowed.");
      return;
    }

    // Add files to state (stored in browser memory)
    setSelectedFiles((prev) => [...prev, ...files]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least 1 certificate file.");
      return;
    }

    if (selectedFiles.length > 3) {
      toast.error("Maximum 3 certificate files allowed.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload files to server
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("registration_id", registrationId);

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
        !uploadData.data?.fileUrls
      ) {
        toast.error(uploadData.message || "Upload failed.");
        setIsUploading(false);
        return;
      }

      const fileUrls = uploadData.data.fileUrls;

      // Save URLs to database
      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/update-advantech-link`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registration_participant_id: registrationParticipantId,
            fileUrls,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        toast.error(updateData.message || "Failed to save certificates.");
        setIsUploading(false);
        return;
      }

      onSuccess?.();
      onOpenChange(false);
      toast.success(
        `${fileUrls.length} certificate${fileUrls.length > 1 ? "s" : ""} uploaded successfully.`
      );
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload certificates. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
      setIsConfirmed(false);
      setIsUploading(false);

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
            Upload Advantech Certificate (1-3 files)
          </DialogTitle>
        </DialogHeader>

        {/* File Input */}
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mainOrange transition-colors"
          >
            <Upload className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-sm text-gray-600">
              Click to select PDF files (max 3)
            </span>
          </label>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            disabled={isUploading || selectedFiles.length >= 3}
            className="hidden"
          />
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Selected Files ({selectedFiles.length}/3):
            </p>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  disabled={isUploading}
                  className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Warning Checkbox */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2 text-xs sm:text-sm md:text-md">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="confirmUpload"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-1 shrink-0"
                disabled={isUploading}
              />
              <label
                htmlFor="confirmUpload"
                className="leading-snug italic break-words flex-1 text-gray-700"
              >
                I confirm that the uploaded certificate(s) are correct. I
                understand that these files can only be uploaded once and cannot
                be changed later.
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          className="mt-4 w-full bg-mainOrange text-white text-sm sm:text-base hover:bg-orange-600"
          onClick={handleSubmit}
          disabled={
            selectedFiles.length === 0 || !isConfirmed || isUploading
          }
        >
          {isUploading
            ? "Uploading..."
            : `Save Certificate${selectedFiles.length > 1 ? "s" : ""}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}