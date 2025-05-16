"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PartnerForm from "@/components/admin/PartnerForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { PageTitle, SaveButton, DiscardButton } from "@/components/layout/InputField";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; 
import funfacts from "@/components/data/funfacts";

export default function AddPartner() {
  const router = useRouter();
  const { user } = useAuth();

  const [partner_name, setPartnerName] = useState("");
  const [category, setCategory] = useState(1);
  const [status, setStatus] = useState(1);
  const [logo, setLogo] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const isFormValid = partner_name.trim() !== "" && logo.length > 0;
  
  const handleImageUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/partner_logo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Upload failed");
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      partner_name,
      category: Number(category),
      status: Number(status),
      partner_logo: logo[0],
    };

    const method = id ? "PUT" : "POST";
    const url = id
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/edit/${id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data partner");

      setDialogContent(id ? "Partner berhasil diperbarui" : "Partner berhasil ditambahkan");
      setShowDialog(true);
    } catch (error) {
      setDialogContent(error.message);
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      const fetchPartnerData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/${id}`);
          const data = await res.json();
          if (res.ok) {
            setPartnerName(data.data.partner_name);
            setCategory(data.data.category);
            setStatus(data.data.status);
            setLogo([data.data.partner_logo]);
          } else {
            throw new Error(data.message || "Failed to fetch data");
          }
        } catch (error) {
          console.error("Fetch partner failed:", error.message);
          setDialogContent("Gagal mengambil data partner");
          setShowDialog(true);
        }
      };

      fetchPartnerData();
    }
  }, [id]);

  const handleDiscard = () => {
    setOpenConfirmDialog(false);
    router.push("/partner-admin");
  };

  const randomFunfact = useMemo(() => {
    const index = Math.floor(Math.random() * funfacts.length);
    return funfacts[index];
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
        <div className="flex flex-wrap justify-between items-center w-full mt-6 mb-4 gap-4">
          <PageTitle title={id ? "Edit Partner" : "Add New Partner"} />

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <SaveButton onClick={handleSubmit} disabled={!isFormValid} />
            <DiscardButton onClick={() => setOpenConfirmDialog(true)} />
          </div>
        </div>

        <ConfirmDialog
          open={openConfirmDialog}
          onCancel={() => setOpenConfirmDialog(false)}
          onConfirm={handleDiscard}
          onDiscard={handleDiscard}
        />

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
            try {
              const url = await handleImageUpload(file);
              setLogo([url]);
            } catch {
              
            }
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
      </div>
    </ProtectedRoute>
  );
}