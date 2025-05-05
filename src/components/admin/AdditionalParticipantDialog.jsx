import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[70vw] xl:max-w-[60vw] p-3 sm:p-5 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto text-sm sm:text-base">
        <DialogHeader>
          <DialogTitle className="text-mainBlue font-semibold text-2xl">Detail Registration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-neutral1 p-2 sm:p-6 rounded-lg shadow-md space-y-1">
            <table className="w-full text-sm sm:text-base text-black break-words">
              <tbody>
                <tr>
                  <td className="font-semibold align-top">Registrant Name</td>
                  <td>: {registration.registrant_name}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Registrant ID</td>
                  <td>: {registration.registrant_id}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Registration Date</td>
                  <td>: {formatDate(registration.registration_date)}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Training Name</td>
                  <td>: {registration.training_name}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Participant Count</td>
                  <td>: {registration.participant_count} Person</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Total Payment</td>
                  <td>: {formatRupiah(registration.total_payment)}</td>
                </tr>
                <tr>
                  <td className="font-semibold align-top">Payment Proof</td>
                  <td>
                    : {registration.payment_proof ? (
                      <a
                        href={registration.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mainBlue underline break-all"
                      >
                        {registration.payment_proof.split("/").pop()}
                      </a>
                    ) : (
                      <span className="text-error2">N/A</span>
                    )}
                  </td>
                </tr>
                {registration.payment_proof && (
                  <tr>
                    <td></td>
                    <td className="pt-2">
                      {registration.payment_proof.endsWith(".pdf") ? (
                        <embed
                          src={registration.payment_proof}
                          type="application/pdf"
                          className="w-full h-48 rounded border"
                        />
                      ) : (
                        <img
                          src={registration.payment_proof}
                          alt="Payment Proof"
                          className="w-auto max-h-48 rounded border"
                        />
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

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
