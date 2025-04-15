"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";

const trainingData = [
  {
    id: 1,
    title: "WISE-4000/LAN Wireless I/O Module Series WISE-4000/LAN Wireless I/O Module Series",
    image: "/assets/gambar1.jpg",
    description:
      "Explore the latest wireless IO module series for industrial automation. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna.",
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

export default function TrainingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; 
  const [training, setTraining] = useState(null);

  useEffect(() => {
    const selected = trainingData.find((item) => item.id === parseInt(id));
    setTraining(selected);
  }, [id]);

  if (!training) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mt-6 mb-6">
        <h1 className="text-2xl font-bold">Training Detail</h1>
        <Button variant="mainBlue" size="sm" className="px-6 py-1" onClick={() => router.push(`/training-admin/edit/`)}>
          <FaEdit className="text-sm" />
          Edit
        </Button>
      </div>
  
      <div className="relative">
        <img
          src={training.image}
          alt={training.title}
          className="w-full h-[380px] object-cover rounded-xl"
        />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 w-full">
          <div className="bg-white/50 px-6 py-3 rounded-md max-w-5xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white drop-shadow text-center leading-snug">
              {training.title}
            </h1>
          </div>
        </div>

        <div className="absolute inset-x-0 -bottom-10 flex justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 flex justify-between items-stretch w-[90%] max-w-4xl shadow-[8px_8px_0px_0px_#157ab2] border-secondBlue border-2">
            <InfoItem label="Level" value={training.level} />
            <VerticalDivider />
            <InfoItem label="Tanggal Pelaksanaan" value={training.date} />
            <VerticalDivider />
            <InfoItem label="Duration" value={training.duration} />
            <VerticalDivider />
            <InfoItem label="Training Fees" value={training.price} />
          </div>
        </div>
      </div>

      <div className="mt-24 space-y-10">
  <div>
    <h2 className="text-2xl text-mainOrange font-bold mb-2">About</h2>
    <p className="text-black text-sm whitespace-pre-line">
      {training.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna.
    </p>
  </div>

  <div>
    <h2 className="text-2xl text-mainOrange font-bold mb-2">Terms and Conditions</h2>
    <p className="text-black text-sm whitespace-pre-line">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
    </p>
  </div>

  <div>
    <h2 className="text-2xl text-mainOrange font-bold mb-2">Skills Earned</h2>
    <p className="text-black text-sm whitespace-pre-line">
      - Wireless Communication{"\n"}
      - I/O Integration{"\n"}
      - Industrial Networking{"\n"}
      - Real-time Monitoring{"\n"}
      - Troubleshooting Field Devices
    </p>
  </div>

  <div>
    <h2 className="text-2xl text-mainOrange font-bold mb-2">Masa berlaku sertifikat</h2>
    <p className="text-black text-sm whitespace-pre-line mb-10">
      Sertifikat berlaku selama 2 tahun setelah tanggal pelaksanaan. Ini memberikan waktu yang cukup untuk memperbarui pengetahuan dan keterampilan yang diperoleh selama pelatihan. Dalam masa berlaku tersebut, peserta juga bisa mengajukan pengakuan kompetensi lebih lanjut.
    </p>
  </div>
</div>

    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 text-center">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-base text-blue-700 font-bold mt-1">{value}</span>
    </div>
  );
}

function VerticalDivider() {
  return (
    <div className="w-px bg-gray-300 mx-2" />
  );
}

