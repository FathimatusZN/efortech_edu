'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function PartnerAdminPage() {
  const [partners, setPartners] = useState([]);

  const fetchPartners = async () => {
    const res = await fetch('/api/partners');
    const data = await res.json();
    setPartners(data.data || []);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Partner Management</h1>
        <Link href="/partner-admin/form">
          <Button>Tambah Partner</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white shadow-md rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Logo</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.partner_id} className="border-t">
                <td className="p-3">
                  {partner.partner_logo ? (
                    <img src={partner.partner_logo} alt="logo" className="h-10 w-10 object-contain" />
                  ) : (
                    <span className="text-gray-400 italic">No logo</span>
                  )}
                </td>
                <td className="p-3">{partner.partner_name}</td>
                <td className="p-3">{partner.category === 1 ? 'College' : 'Institution'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${partner.status ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                    {partner.status ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/partner-admin/form?id=${partner.partner_id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Belum ada data partner.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
