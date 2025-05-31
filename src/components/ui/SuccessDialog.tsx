"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  messages?: string[];
  buttonText?: string;
  onButtonClick?: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Submission Success!",
  messages = ["We'll email the result to you soon.", "Have a great day!"],
  buttonText = "Okay",
  onButtonClick,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-4 border-mainBlue p-6 rounded-lg shadow-lg text-center w-full max-w-sm bg-white
                   [&>button.absolute]:hidden" // sembunyikan tombol close default
      >
        <FaCheckCircle className="text-green-500 text-8xl mt-8 mx-auto mb-4" />
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
          className="px-4 py-2 mb-4 bg-mainOrange text-white rounded-md hover:bg-secondOrange"
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
