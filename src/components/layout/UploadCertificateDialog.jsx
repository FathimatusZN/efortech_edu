"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check if the file is a PDF
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

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

      // success
      onSuccess?.();
      onOpenChange(false);
      toast.success("Certificate uploaded successfully.");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to save certificate. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Upload Sertifikat Advantech</DialogTitle>
        <input type="file" accept="application/pdf" onChange={handleFileChange} disabled={isUploading} />
        <Button
          className="mt-4 w-full bg-mainOrange text-white"
          onClick={handleSubmit}
          disabled={!fileUrl}
        >
          Save Certificate
        </Button>
      </DialogContent>
    </Dialog>
  );
}
