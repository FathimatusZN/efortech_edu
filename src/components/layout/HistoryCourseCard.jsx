"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HistoryCourseCard({ 
  id, 
  image, 
  title, 
  date, 
  time, 
  mode, 
  status, 
  isCompleted = false, 
  hasCertificate = false 
}) {
  const router = useRouter();

  const handleWriteReview = () => {
    router.push(`/training/${id}/review`);
  };

  const handleUploadPayment = () => {
    router.push(`/training/${id}/upload-payment`);
  };

  return (
    <div className="bg-white w-full max-w-[5000px] max-h-[433px] border-2 border-mainBlue rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* IMAGE */}
      <div className="relative w-full max-w-[500px] p-4">
        <img src={image} alt={title} className="w-full h-[200px] rounded-xl object-cover" />
      </div>

      {/* COURSE INFO */}
      <div className="p-4 text-center">
        <div className="flex justify-center gap-2 text-sm font-light text-mainOrange">
          <span className="border-2 border-mainOrange px-2 py-1 rounded-xl bg-neutral1">{mode}</span>
          <span className="border-2 border-mainOrange px-2 py-1 rounded-xl bg-neutral1">{date}</span>
          <span className="border-2 border-mainOrange px-2 py-1 rounded-xl bg-neutral1">{time}</span>
        </div>

        <h2 className="text-lg font-semibold text-blue-900 my-3">{title}</h2>

        {/* CONDITIONAL BUTTONS */}
        {status === "waiting for payment" || status === "pending" ? (
          <Button 
            variant="orange" 
            className="w-full" 
            disabled={status === "pending"} 
            onClick={handleUploadPayment}
          >
            Upload Bukti Pembayaran
          </Button>
        ) : status === "validated" ? (
          <div className="flex flex-col items-center w-full gap-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={handleWriteReview} 
              className="border-2 border-lightBlue w-full"
              disabled={!isCompleted}
            >
              Review
            </Button>
            <Button 
              variant="lightBlue" 
              className="w-full" 
              disabled={!hasCertificate}
            >
              Download Certificate
            </Button>
          </div>
        ) : (
          <Button variant="orange" className="w-full">
            <a href={`/course/${id}`}>See Details</a>
          </Button>
        )}
      </div>
    </div>
  );
}