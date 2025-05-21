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
    </div>
  );
}
