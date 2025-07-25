import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const AdvantechCertificateDetailDialog = ({ open, onClose, item }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsLoading(true); // reset loading state when dialog opens
    }
  }, [open]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-3xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Advantech Certificate Preview</DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <LoadingSpinner className="w-10 h-10" />
            </div>
          )}
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(item.advantech_cert)}`}
            title="Advantech Certificate File"
            className="w-full h-full border"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
