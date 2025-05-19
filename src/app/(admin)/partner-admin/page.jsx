'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PartnerTable from '@/components/admin/PartnerTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PartnerAdminPage() {
  const [partner, setPartner] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const router = useRouter();

  const fetchPartner = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner`);
      const data = await res.json();
      setPartner(data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data partner:', err);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchPartner();
  }, []);

  const handleAddPartner = () => {
    setLoadingAdd(true);
    setTimeout(() => {
      router.push('/partner-admin/form-partner');
    }, 1000);
  };

  const showFullLoading = loadingAdd || loadingFetch;

  return (
    <>
      {showFullLoading ? (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 py-10 text-center">
          <LoadingSpinner size={32} text="Loading..." className="mb-4" />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Partner Management</h1>
            <Button variant="orange" onClick={handleAddPartner}>
              Add Partner
            </Button>
          </div>

          <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#157ab2]">
            <PartnerTable partner={partner} onDeletePartner={fetchPartner} />
          </div>
        </div>
      )}
    </>
  );
}
