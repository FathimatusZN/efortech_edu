// components/admin/UserCertificateDetailDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).replace(",", "");
};
export const UserCertificateDetailDialog = ({ open, onClose, item, mode }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-3xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Certificate Preview</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]">
          <iframe
            src={item.cert_file}
            title="Certificate File"
            className="w-full h-full border"
          />
        </div>

        {mode === "completed" && (
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <table className="w-full text-sm sm:text-base text-black break-words">
              <tbody>
                <tr>
                  <td className="font-semibold align-top">Verified By</td>
                  <td>: {item.verified_by}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Verification Date</td>
                  <td>: {formatDate(item.verification_date)}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Notes</td>
                  <td>: {item.notes || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
