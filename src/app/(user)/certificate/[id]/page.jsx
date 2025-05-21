"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CertificateDetailPage() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/${id}`
        );
        const data = await res.json();

        if (data.status === "success") {
          setCertificate(data.data);
        } else {
          setCertificate(null);
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setCertificate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-sm">Loading...</div>;
  if (!certificate)
    return (
      <div className="p-6 text-center text-sm text-red-500">
        Certificate not found
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 text-sm">

      {/* Certificate Card */}
      <div className="flex flex-col gap-4 rounded-lg p-4 bg-white outline outline-2 outline-mainBlue shadow-[6px_6px_0px_0px_#157ab2]">
        {/* Certificate Title */}
        <h2 className="text-2xl font-bold text-mainBlue">
          Certificate Detail
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Certificate Info */}
          <div className="md:w-1/3 w-full flex flex-col items-center gap-2 rounded-xl border p-3 shadow bg-white text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center">
              <img
                src={certificate.user_photo}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />
            </div>

            <p className="text-base font-semibold">{certificate.fullname}</p>

            <div className="mt-3 w-full text-sm text-black text-center space-y-1.5">
              <div>
                <h2 className="text-xl font-bold text-mainBlue text-center">
                  {certificate.certificate_title}
                </h2>
              </div>
              <div>
                <span>Certificate Number:</span>
                <div className="font-semibold">{certificate.certificate_number}</div>
              </div>
              <div>
                <span>Issued Date:</span>
                <div className="font-semibold">
                  {new Date(certificate.issued_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div>
                <span>Expired Date:</span>
                <div className="font-semibold">
                  {new Date(certificate.expired_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div>
                <span>Status:</span>
                <div
                  className={`font-semibold ${certificate.certificate_status === "Valid"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {certificate.certificate_status}
                </div>
              </div>
            </div>
          </div>

          {/* PDF Preview */}
          <div className="md:w-2/3 w-full border rounded-lg shadow overflow-hidden">
            <iframe
              src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                certificate.cert_file
              )}`}
              className="w-full h-[400px]"
              title="Certificate PDF Preview"
            />
          </div>
        </div>
      </div>

      {/* Training Info */}
      {certificate.type === 1 && certificate.training && (
        <div className="mt-6 p-4 rounded-lg bg-white border shadow text-sm space-y-3">
          <h2 className="text-base font-semibold text-mainBlue">Training Information</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Gambar Training */}
            <div className="md:w-1/3 w-full">
              <img
                src={certificate.training.images?.[0]}
                alt={certificate.training.training_name}
                className="w-full h-auto object-cover rounded-md border"
              />
            </div>

            {/* Detail Training */}
            <div className="md:w-2/3 w-full space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{certificate.training.training_name}</h3>

                <div className="flex gap-5">
                  {/* Level */}
                  <div className="text-sm text-mainBlue font-bold">
                    {certificate.training.level === 1
                      ? "Beginner Level"
                      : certificate.training.level === 2
                        ? "Intermediate Level"
                        : "Advanced Level"}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.954L10 0l2.952 5.956 6.561.954-4.757 4.635 1.122 6.545z" />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      {certificate.training.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm">{certificate.training.description}</p>

                {/* Skills */}
                {certificate.training.skills?.length > 0 && (
                  <div>
                    <span className="font-medium text-xs">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {certificate.training.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-mainBlue/10 text-mainBlue px-2 py-0.5 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* See Detail Button */}
              <div className="flex justify-end pt-1">
                <a
                  href={`/training/${certificate.training.training_id}`}
                  className="inline-block px-4 py-1 text-md font-medium text-white bg-mainBlue rounded hover:bg-lightBlue transition"
                >
                  See Detail
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
