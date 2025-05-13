"use client";

import { useState } from "react";
import PartnerForm from "@/components/admin/PartnerForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function AddPartner() {
  const router = useRouter();

  const [partner_name, setPartnerName] = useState("");
  const [category, setCategory] = useState("institution");
  const [status, setStatus] = useState(1);
  const [logo, setLogo] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const handleImageUpload = async (file) => {
    if (!file) {
      console.error("No file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/partner_logo`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error("Upload failed:", text);
        throw new Error("Upload failed");
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data.data.imageUrl;
      } else {
        throw new Error("Invalid JSON response");
      }
    } catch (error) {
      console.error("Image upload error:", error.message);
      throw error;
    }
  };  

  const handleSubmit = async () => {
    setLoading(true); 
    const formData = {
      partner_name,
      category,
      status,
      partner_logo: logo[0], 
    };
  
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan partner");
      }
  
      setDialogContent("Partner berhasil ditambahkan");
      setShowDialog(true);
    } catch (error) {
      setDialogContent(error.message);
      setShowDialog(true);
    } finally {
      setLoading(false); // Proses selesai
    }
  };  

  return (
    <main className="px-6 pb-12">
      <div className="flex items-center gap-3 my-6">
        <Link href="/admin/partner" className="rounded-full bg-mainBlue text-white p-2 hover:bg-blue-700 transition">
          <FaArrowLeftLong />
        </Link>
        <h1 className="text-xl font-bold">Add Partner</h1>
      </div>

      <PartnerForm
        partner_name={partner_name}
        setPartnerName={setPartnerName}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        logo={logo}
        setLogo={setLogo}
        onImageUpload={async (file) => {
          const url = await handleImageUpload(file);
          setLogo([url]);
        }}
      />

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <p className="mb-4">{dialogContent}</p>
            <button
              onClick={() => {
                setShowDialog(false);
                if (dialogContent.includes("berhasil")) {
                  router.push("/partner-admin");
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
