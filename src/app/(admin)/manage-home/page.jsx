'use client';

import { useState } from 'react';
import PartnerAdminPage from "./partner-admin/page";
import CarouselUploader from "./carousel/page"; 

export default function ManageHomePage() {
  const [activeTab, setActiveTab] = useState('carousel');

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-3xl font-bold mb-6">Manage Home</h1>
      <div className="flex gap-6 border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab('carousel')}
          className={`pb-2 font-semibold ${
            activeTab === 'carousel' ? 'text-mainBlue border-b-2 border-mainBlue' : 'text-gray-500'
          }`}
        >
          Carousel Content
        </button>
        <button
          onClick={() => setActiveTab('partner')}
          className={`pb-2 font-semibold ${
            activeTab === 'partner' ? 'text-mainBlue border-b-2 border-mainBlue' : 'text-gray-500'
          }`}
        >
          Manage Partner
        </button>
      </div>

      {activeTab === 'carousel' && <CarouselUploader />}
      {activeTab === 'partner' && <PartnerAdminPage />}
    </div>
  );
}
