"use client";

import { InputField, ImageUploader } from "@/components/layout/InputField";
import { Switch } from "@/components/ui/switch";

export default function PartnerForm({
  partner_name,
  setPartnerName,
  category,
  setCategory,
  status,
  setStatus,
  logo,
  setLogo,
  onImageUpload,
}) {
    
  return (
    <div className="outline outline-3 outline-mainBlue p-6 bg-white shadow-md rounded-lg border w-full">
      <div className="flex flex-wrap md:flex-nowrap gap-8 justify-between">
        <div className="w-full md:w-[75%] flex flex-col space-y-4">
          <InputField
            label="Partner Name"
            placeholder="Type partner name here"
            required
            className="mt-2"
            value={partner_name}
            onChange={(e) => setPartnerName(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="text-xl font-semibold block mb-2">Partner Status</label>
          <div className="flex items-center justify-start gap-x-4 mb-1">
            <span className="text-md text-gray-600 min-w-[70px] text-left">
              {status === 1 ? 'Active' : 'Archived'}
            </span>
            <Switch
              checked={status === 1}
              onCheckedChange={(checked) => setStatus(checked ? 1 : 0)}
              className="data-[state=checked]:bg-mainBlue bg-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <label className="block text-md font-semibold w-full mb-2">
          Partner Category<span className="text-red-500"> *</span>
        </label>
        <div className="mt-1 flex gap-12 flex-wrap">
          {[
            { label: 'Institution', value: 1 },
            { label: 'College', value: 2 },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="category"
                  value={item.value}
                  checked={category === item.value}
                  onChange={() => setCategory(item.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${category === item.value ? 'border-mainBlue' : 'border-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${category === item.value ? 'bg-mainBlue' : 'bg-gray-300'}`} />
                </div>
              </div>
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full md:w-[40%]">
        <ImageUploader
          maxImages={1}
          images={logo}
          setImages={setLogo}
          onImageUpload={onImageUpload}
          uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/partner_logo`}
        />
      </div>
    </div>
  );
}
