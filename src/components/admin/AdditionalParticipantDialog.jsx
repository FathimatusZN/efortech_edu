import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const AdditionalParticipantDialog = ({ open, onClose, participants }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Participants</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {participants.map((p) => (
            <div key={p.registration_participant_id} className="border p-2 rounded-md">
              <p><strong>Name:</strong> {p.participant_name}</p>
              <p><strong>Email:</strong> {p.email}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
