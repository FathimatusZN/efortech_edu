'use client';

import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import PartnerTable from '@/components/admin/PartnerTable';
import PartnerForm from '@/components/admin/PartnerForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { PageTitle, SaveButton, DiscardButton } from "@/components/layout/InputField";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { FaSearch, FaPlus} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'; 

export default function PartnerAdminPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [partner_name, setPartnerName] = useState("");
  const [category, setCategory] = useState(1);
  const [status, setStatus] = useState(1);
  const [logo, setLogo] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); 
  const [dialogContent, setDialogContent] = useState('');

  const isFormValid = partner_name.trim() !== "" && logo.length > 0;

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      if (debouncedSearchTerm) query.append("search", debouncedSearchTerm);
      if (filterCategory !== "") query.append("category", filterCategory);
      if (filterStatus !== "") query.append("status", filterStatus);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner?${query.toString()}`);
      const data = await res.json();
      setPartners(data.data || []);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerById = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/${id}`);
      const data = await res.json();
      if (res.ok) {
        setPartnerName(data.data.partner_name);
        setCategory(data.data.category);
        setStatus(data.data.status);
        setLogo([data.data.partner_logo]);
      } else {
        throw new Error(data.message || "Failed to fetch partner");
      }
    } catch (error) {
      console.error("Fetch partner failed:", error.message);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchPartners();
  }, [debouncedSearchTerm, filterCategory, filterStatus]);

  const handleAddPartner = () => {
    setPartnerName("");
    setCategory(1);
    setStatus(1);
    setLogo([]);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditPartner = (id) => {
    setEditingId(id);
    setShowForm(true);
    fetchPartnerById(id);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/partner_logo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      return data.data.imageUrl;
    } catch (error) {
      console.error("Image upload error:", error.message);
      throw error;
    }
  };

  const setDialog = (type, message) => {
    setDialogType(type);
    setDialogContent(message);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLoading(true);

    const formData = {
      partner_name,
      category: Number(category),
      status: Number(status),
      partner_logo: logo[0],
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/edit/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save partner");

      await fetchPartners();
      setShowForm(false);
      setDialog('success', editingId ? "Partner updated successfully." : "Partner added successfully.");
    } catch (error) {
      console.error(error.message || "Something went wrong. Please try again.");
      setDialog('error', error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setOpenConfirmDialog(false);
    setShowForm(false);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      {loading ? (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
          <LoadingSpinner size={32} text="Loading..." />
        </div>
      ) : (
        <div className="relative">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className={dialogType === 'success' ? 'text-green-600' : 'text-red-600'}>
                  {dialogType === 'success' ? 'Success' : 'Error'}
                </DialogTitle>
                <DialogDescription>
                  {dialogContent}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {showForm ? (
            <div className="max-w-[1440px] mx-auto">
              <div className="flex flex-wrap justify-between items-center w-full mb-4 gap-4">
                <div className="text-2xl font-bold">
                  {editingId ? "Edit Partner" : "Add Partner"} </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <SaveButton onClick={handleSubmit} disabled={!isFormValid || isSubmitting} />
                  <DiscardButton onClick={() => setOpenConfirmDialog(true)} />
                </div>
              </div>

              <ConfirmDialog
                open={openConfirmDialog}
                onCancel={() => setOpenConfirmDialog(false)}
                onConfirm={async () => {
                  await handleSubmit();
                  setOpenConfirmDialog(false);
                }}
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
                  } catch {}
                }}
              />
            </div>
          ) : (
            <>
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-4">
                <h2 className="text-2xl font-bold">Partner Management</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-sm w-full pl-4 pr-4 h-10 py-2 rounded-md border-2 border-mainOrange focus:ring-0 focus:outline-none"
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>

                  <select
                    className="w-[150px] h-10 border-2 border-mainOrange rounded-md focus:ring-0 focus:outline-none text-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Category</option>
                    <option value="1">Institution</option>
                    <option value="2">College</option>
                  </select>

                  <select
                    className="w-[150px] h-10 border-2 border-mainOrange rounded-md focus:ring-0 focus:outline-none text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Archived</option>
                  </select>

                  <Button variant="orange" onClick={handleAddPartner}>
                    <FaPlus size={20} /> Add Partner
                  </Button>
                </div>
              </div>
              <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#157ab2]">
                <PartnerTable
                  partner={partners}
                  onDeletePartner={fetchPartners}
                  onEditPartner={handleEditPartner}
                />
              </div>
            </>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}