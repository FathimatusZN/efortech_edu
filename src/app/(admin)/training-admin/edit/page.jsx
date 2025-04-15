"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import TrainingForm from "@/components/admin/TrainingForm";
import { Button } from "@/components/ui/button";

const trainingData = [
  {
    id: 1,
    name: "WISE-4000/LAN Wireless I/O Module Series",
    description: "Explore the latest wireless IO module series for industrial automation.",
    fee: "50.000",
    discount: "20",
    level: "Beginner",
    date: "25 - 28 February 2025",
    duration: "24", // dalam jam
    validity: "24", // dalam bulan
    skills: [
      "Wireless Communication",
      "I/O Integration",
      "Industrial Networking",
      "Real-time Monitoring",
      "Troubleshooting Field Devices"
    ],
    terms: [
      "Participants must bring their own laptop.",
      "Basic understanding of industrial automation is recommended.",
      "Training materials will be provided in digital format.",
      "Certificates will be issued upon completion.",
      "Participants are expected to attend all sessions."
    ],
    images: [
      "/images/trainings/wise4000-1.jpg",
      "/images/trainings/wise4000-2.jpg",
      "/images/trainings/wise4000-3.jpg"
    ]
  }
];

export default function EditPage() {
  const [training, setTraining] = useState(trainingData[0]); // Menggunakan data statis untuk id=1
  const [isFormValid, setIsFormValid] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleCreate = (data) => {
    console.log("Training updated:", data);
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Training</h1>
        <div className="flex gap-2">
          <Button
            type="submit"
            form="form-training"
            disabled={!canSubmit}
            variant={isFormValid ? "mainBlue" : "outline"}
            size="default"
          >
            Save
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="default"
          >
            <FaTrash />
            Delete
          </Button>
        </div>
      </div>
      <TrainingForm
        initialData={training} // Mengirimkan data yang ada ke form
        onValidationChange={(isValid) => setCanSubmit(isValid)}
      />
    </div>
  );
}
