"use client";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

const trainingData = [
  {
    id: 1,
    title: "WISE-4000/LAN Wireless I/O Module Series",
    image: "/assets/gambar1.jpg",
    description:
      "Explore the latest wireless IO module series for industrial automation.",
    price: "Rp50.000",
    status: "Aktif",
    level: "Beginner",
    date: "25 - 28 February 2025",
    duration: "24 Hours",
  },
  {
    id: 2,
    title: "Mastering EdgeLink: IoT Gateway for Seamless OT-IT Integration",
    image: "https://source.unsplash.com/400x300/?server",
    description:
      "Learn how to integrate IoT gateways with seamless OT-IT connectivity.",
    price: "Rp300.000",
    status: "Aktif",
    level: "Intermediate",
    date: "10 - 12 March 2025",
    duration: "18 Hours",
  },
];

export default function TrainingDetailPage({ params }) {
  const { id } = params;
  const [training, setTraining] = useState(null);

  useEffect(() => {
    const selected = trainingData.find((item) => item.id === parseInt(id));
    setTraining(selected);
  }, [id]);

  if (!training) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mt-8 mb-4">
        <h1 className="text-2xl font-bold">Training Detail</h1>
        <button className="flex items-center gap-2 text-white shadow-md px-6 py-1 rounded-md text-sm bg-mainBlue hover:bg-secondBlue">
          <FaEdit className="text-sm" /> Edit
        </button>
      </div>

      <div className="relative">
        <img
          src={training.image}
          alt={training.title}
          className="w-full h-[380px] object-cover rounded-xl"
        />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/50 px-6 py-3 rounded-md">
          <h1 className="text-xl md:text-4xl font-bold text-white drop-shadow">
            {training.title}
          </h1>
        </div>
        <div className="absolute inset-x-0 -bottom-10 flex justify-center">
          <div className="bg-white shadow-xl rounded-2xl px-8 py-6 flex flex-wrap justify-between gap-6 w-[90%] max-w-4xl">
            <InfoItem label="Level" value={training.level} />
            <InfoItem label="Tanggal Pelaksanaan" value={training.date} />
            <InfoItem label="Duration" value={training.duration} />
            <InfoItem label="Training Fees" value={training.price} />
          </div>
        </div>
      </div>

      <div className="mt-24 space-y-10">
        <h1 className="text-3xl font-bold text-center">{training.title}</h1>

        <Section title="About">
          <p className="text-gray-700 text-justify">
            {training.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan...
          </p>
        </Section>

        <Section title="Terms and Conditions" highlight>
          <p className="text-gray-700 text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus...
          </p>
        </Section>

        <Section title="Skills Earned">
          <p className="text-gray-700 text-justify">
            - Wireless Communication<br />
            - I/O Integration<br />
            - Industrial Networking
          </p>
        </Section>

        <Section title="Masa berlaku sertifikat" color="text-orange-600">
          <p className="text-gray-700 text-justify">
            Sertifikat berlaku selama 2 tahun setelah tanggal pelaksanaan.
          </p>
        </Section>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col text-center min-w-[120px]">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-base text-blue-700 font-bold mt-1">{value}</span>
    </div>
  );
}

function Section({ title, children, highlight = false, color = "text-black" }) {
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-2 ${highlight ? "text-orange-500" : color}`}>{title}</h2>
      {children}
    </div>
  );
}
