"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UploadCertificateDialog({
  open,
  onOpenChange,
  registrationId,
  onSuccess,
}) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    // upload ke backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("registration_id", registrationId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/upload-advantech`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      onSuccess?.();
    } else {
      alert("Upload gagal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Upload Sertifikat Advantech</DialogTitle>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button
          className="mt-4 w-full bg-mainOrange text-white"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  );
}
