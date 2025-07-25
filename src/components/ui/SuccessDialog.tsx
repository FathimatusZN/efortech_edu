import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  messages?: string[];
  buttonText?: string;
  onButtonClick?: () => void;
  type?: "success" | "error";
}

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Submission Success!",
  messages = ["We'll email the result to you soon.", "Have a great day!"],
  buttonText = "Okay",
  onButtonClick,
  type = "success", // default success
}: SuccessDialogProps) {
  const Icon = type === "success" ? FaCheckCircle : FaTimesCircle;
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`border-4 ${
          type === "success" ? "border-mainBlue" : "border-red-400"
        } p-6 rounded-lg shadow-lg text-center w-full max-w-sm bg-white
        [&>button.absolute]:hidden`}
      >
        <Icon className={`${iconColor} text-8xl mt-8 mx-auto mb-4`} />
        <DialogTitle className="text-lg font-bold text-black mb-2">
          {title}
        </DialogTitle>
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className="text-sm font-normal text-mainGrey mb-1 last:mb-4"
          >
            {msg}
          </p>
        ))}
        <Button
          onClick={() => {
            onOpenChange(false);
            if (onButtonClick) onButtonClick();
          }}
          className={`px-4 py-2 mb-4 ${
            type === "success"
              ? "bg-mainOrange hover:bg-secondOrange"
              : "bg-red-500 hover:bg-red-600"
          } text-white rounded-md`}
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
