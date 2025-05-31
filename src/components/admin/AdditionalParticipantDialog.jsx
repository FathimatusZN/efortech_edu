import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};


export const AdditionalParticipantDialog = ({ open, onClose, registration }) => {
  const [isPreviewLoading, setPreviewLoading] = useState(true);

  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] p-2 sm:p-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto text-sm sm:text-base">
        <DialogHeader>
          <DialogTitle className="text-mainBlue font-semibold text-2xl">Detail Registration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-neutral1 p-2 sm:p-6 rounded-lg shadow-md space-y-1">
            {/* Registration Detail */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-1 gap-x-2 text-sm sm:text-base text-center sm:text-left">
              <div className="font-semibold">Registrant Name</div>
              <div>{registration.registrant_name}</div>

              <div className="font-semibold">Registrant ID</div>
              <div>{registration.registrant_id}</div>

              <div className="font-semibold">Registration Date</div>
              <div>{formatDate(registration.registration_date)}</div>

              <div className="font-semibold">Training Name</div>
              <div>{registration.training_name}</div>

              <div className="font-semibold">Participant Count</div>
              <div>{registration.participant_count} Person</div>

              <div className="font-semibold">Total Payment</div>
              <div>{formatRupiah(registration.total_payment)}</div>

              <div className="font-semibold">Payment Proof</div>
              <div>
                {registration.payment_proof ? (
                  <a
                    href={registration.payment_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mainBlue underline break-words"
                  >
                    {registration.payment_proof.split("/").pop()}
                  </a>
                ) : (
                  <span className="text-error2">N/A</span>
                )}
              </div>
            </div>
            {registration.payment_proof && (
              <div>
                <div className="pt-2 relative min-h-[50px]">
                  {isPreviewLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                      <LoadingSpinner className="w-8 h-8 text-mainBlue" />
                    </div>
                  )}

                  {registration.payment_proof.endsWith(".pdf") ? (
                    <iframe
                      src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(registration.payment_proof)}`}
                      title="Payment Proof PDF"
                      className="w-full min-h-[200px] md:min-h-[400px] border rounded"
                      onLoad={() => setPreviewLoading(false)}
                    />
                  ) : (
                    <img
                      src={registration.payment_proof}
                      alt="Payment Proof"
                      className="w-auto max-h-48 rounded border"
                      onLoad={() => setPreviewLoading(false)}
                      onError={() => setPreviewLoading(false)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Participants Table */}
            <div className="mt-6 space-y-2">
              <p className="font-semibold text-mainBlue">Participants:</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[100px] table-auto border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-mainBlue text-white">
                      <th className="px-1 py-3 text-left">Participant ID</th>
                      <th className="px-1 py-3 text-left">Name</th>
                      <th className="px-1 py-3 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registration.participants?.map((p) => (
                      <tr key={p.registration_participant_id} className="border-t border-neutral2">
                        <td className="px-1 py-3">{p.registration_participant_id}</td>
                        <td className="px-1 py-3">{p.participant_name}</td>
                        <td className="px-1 py-3 break-words max-w-[150px]">{p.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
