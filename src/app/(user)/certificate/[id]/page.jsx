"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CertificateDetailPage() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/${id}`
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!certificate)
    return (
      <div className="p-8 text-center text-red-500">Certificate not found</div>
    );

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="flex flex-col md:flex-row gap-6 rounded-lg p-6 bg-white outline outline-3 outline-mainBlue shadow-[8px_8px_0px_0px_#157ab2]">
        {/* Certificate Info */}
        <div className="md:w-1/3 w-full flex flex-col items-center gap-2 rounded-xl border p-4 shadow bg-white text-center">
          <div className="w-28 h-28 rounded-full flex items-center justify-center">
            <img
              src={certificate.user_photo}
              alt="User"
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
          </div>

          <p className="text-lg font-bold">{certificate.fullname}</p>

          <div className="mt-4 w-full text-md text-black text-center space-y-2">
            <div>
              <span>Certificate Number:</span>
              <div className="font-bold">{certificate.certificate_number}</div>
            </div>
            <div>
              <span>Issued Date:</span>
              <div className="font-bold">
                {new Date(certificate.issued_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div>
              <span>Completed Date:</span>
              <div className="font-bold">
                {new Date(certificate.completed_date).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </div>
            </div>
            <div>
              <span>Expired Date:</span>
              <div className="font-bold">
                {new Date(certificate.expired_date).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </div>
            </div>
            <div>
              <span>Status:</span>
              <div
                className={`font-bold ${
                  certificate.status_certificate === "Valid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {certificate.status_certificate}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="md:w-2/3 w-full border rounded-lg shadow overflow-hidden">
          <iframe
            src={certificate.cert_file}
            className="w-full h-[500px]"
            title="Certificate PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
