"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import TrainingForm from "@/components/admin/TrainingForm";

export default function AddPage() {
  const [isFormValid, setIsFormValid] = useState(false);

  const handleCreate = (data) => {
    console.log("Training created:", data);
  };
  <TrainingForm onValidationChange={setIsFormValid} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Add Training</h1>
        <div className="flex gap-2">
          <button
            type="submit"
            form="form-training"
            disabled={!isFormValid}
            className={`px-6 py-2 border-2 rounded-md font-semibold transition ${
              isFormValid
                ? "bg-mainBlue text-white border-mainBlue hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
            }`}
          >
            Save
          </button>
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm"
            onClick={() => console.log("Delete clicked")}
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
      <TrainingForm onSubmit={handleCreate} onValidationChange={setIsFormValid} />
    </div>
  );
}
