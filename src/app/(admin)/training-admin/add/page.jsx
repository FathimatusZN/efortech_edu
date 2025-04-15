"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import TrainingForm from "@/components/admin/TrainingForm";
import { Button } from "@/components/ui/button";

export default function AddPage() {
  const [formIsValid, setIsFormValid] = useState(false);

  const handleCreate = (data) => {
    console.log("Training created:", data);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Training</h1>
        <div className="flex gap-2 items-center">
          <Button
            type="submit"
            variant="mainBlue"
            size="lg"
            disabled={!formIsValid}
            className="px-6 py-2"
          >
            Save
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={() => console.log("Delete clicked")}
            className="flex items-center gap-2 px-6 py-2"
          >
            <FaTrash />
            Delete
          </Button>
        </div>
      </div>
      <TrainingForm onSubmit={handleCreate} onValidationChange={setIsFormValid} />
    </div>
  );
}
