"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export default function UploadPaymentDialog({
  open,
  onOpenChange,
  registrationId,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Pilih file terlebih dahulu");

    setLoading(true);

    try {
      // Upload file
      const formData = new FormData();
      formData.append("files", file);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/upload-payment`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadRes.json();

      const fileUrl = uploadResult.data?.fileUrl;

      if (!uploadRes.ok || !fileUrl) {
        throw new Error(uploadResult.message || "Gagal upload file.");
      }

      // Simpan fileUrl ke endpoint save
      const saveRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/save-payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registration_id: registrationId,
            fileUrl: fileUrl,
          }),
        }
      );

      const saveResult = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(
          saveResult.message || "Gagal menyimpan bukti pembayaran."
        );
      }

      setFile(null);
      onOpenChange(false);
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              Silakan upload bukti pembayaran Anda untuk menyelesaikan
              pendaftaran.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Registration ID</Label>
              <Input value={registrationId} readOnly className="bg-gray-100" />
            </div>

            <div>
              <Label>File Bukti Pembayaran</Label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <Button
              variant="orange"
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full"
            >
              {loading ? "Uploading..." : "Kirim"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Success!"
        messages={["We'll confirm your payment soon.", "Have a great day!"]}
        buttonText="Okay"
      />
    </>
  );
}
