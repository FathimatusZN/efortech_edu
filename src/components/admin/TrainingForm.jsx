"use client";
import { FaClock, FaMoneyBill, FaTag, FaCheckCircle } from "react-icons/fa";
import { InputField, ImageUploader, SkillsInput } from "@/components/layout/InputField";
import { Switch } from "@/components/ui/switch";

export default function TrainingForm({
  training_name,
  setTrainingname,
  status,
  setStatus,
  description,
  setDescription,
  level,
  setLevel,
  duration,
  setDuration,
  training_fees,
  setTrainingfees,
  discount,
  setDiscount,
  validity_period,
  setValidityperiod,
  term_condition,
  setTermcondition,
  skills,
  setSkills,
  images,
  setImages,
  onImageUpload,
  onSubmit,
}) {
  return (
    <div className="outline outline-3 outline-mainBlue p-6 bg-white shadow-md rounded-lg border w-full">

      <div className="flex flex-wrap md:flex-nowrap gap-8 justify-between">
        <div className="w-full md:w-[75%] flex flex-col space-y-4">
          <InputField
            label="Training Name"
            placeholder="Type training name here.."
            required
            className="mt-2"
            value={training_name}
            onChange={(e) => setTrainingname(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="text-lg font-semibold block mb-2">Training Status</label>
          <div className="flex items-center justify-start gap-x-4 mb-1">
            <span className="text-md text-gray-600 min-w-[70px] text-left">
              {status === 1 ? 'Active' : 'Archived'}
            </span>
            <Switch
              checked={status === 1}
              onCheckedChange={(checked) => setStatus(checked ? 1 : 2)}
              className="data-[state=checked]:bg-mainBlue bg-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="w-full mt-4 relative">
        <label className="block text-md font-semibold w-full">
          Description<span className="text-red-500"> *</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Type description here"
          className="mt-2 w-full border border-mainBlue p-2 pr-6 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue resize-none min-h-[80px] overflow-hidden"
          required
        />
      </div>

      <div className="w-full mt-4">
        <label className="block text-md font-semibold w-full">
          Level<span className="text-red-500"> *</span>
        </label>
        <div className="mt-2 flex gap-12 flex-wrap">
          {[
            { label: 'Beginner', value: 1 },
            { label: 'Intermediate', value: 2 },
            { label: 'Advanced', value: 3 },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="level"
                  value={item.value}
                  checked={level === item.value}
                  onChange={() => setLevel(item.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${level === item.value ? 'border-mainBlue' : 'border-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${level === item.value ? 'bg-mainBlue' : 'bg-gray-300'}`} />
                </div>
              </div>
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Training Duration<span className="text-red-500"> *</span></label>
          <div className="mt-2 flex items-center gap-2">
            <FaClock className="text-mainBlue" size={20} />
            <div className="relative w-full">
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration"
                className="w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm pointer-events-none">Hours</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Training Fees<span className="text-red-500"> *</span></label>
          <div className="mt-2 flex items-center gap-2">
            <FaMoneyBill className="text-mainBlue" size={20} />
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-sm">Rp</span>
              <input
                type="text"
                value={training_fees}
                onChange={(e) => setTrainingfees(e.target.value)}
                placeholder="e.g. 1500000"
                className="w-full border border-mainBlue px-3 py-2 pl-10 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Discount</label>
          <div className="mt-2 flex items-center gap-2">
            <FaTag className="text-mainBlue" size={20} />
            <div className="relative w-full">
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0-100"
                className="w-full border border-mainBlue px-3 py-2 pr-8 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm font-semibold pointer-events-none">%</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Certificate Validity Period<span className="text-red-500"> *</span></label>
          <div className="mt-2 flex items-center gap-2">
            <FaCheckCircle className="text-mainBlue" size={20} />
            <div className="relative w-full">
              <input
                type="text"
                value={validity_period}
                onChange={(e) => setValidityperiod(e.target.value)}
                placeholder="Duration in months"
                className="w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm pointer-events-none">Months</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-4">
        <label className="block text-sm font-semibold w-full">
          Terms and Conditions<span className="text-red-500"> *</span>
        </label>
        <textarea
          value={term_condition}
          onChange={(e) => {
            setTermcondition(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Type terms here, one per line"
          className="mt-2 w-full border border-mainBlue p-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue resize-none min-h-[80px] overflow-hidden"
          required
        />
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-8 mt-4">
        <div className="w-full md:w-[40%] flex flex-col">
          <label className="font-semibold block mb-1">
            Skills <span className="text-red-500">*</span>
          </label>
          <SkillsInput skills={skills} setSkills={setSkills} />
        </div>

        <div className="w-full md:w-[60%]">
          <ImageUploader
            maxImages={3}
            images={images}
            setImages={setImages}
            onImageUpload={onImageUpload}
            uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training/upload-training-image`}
          />
        </div>
      </div>
    </div>
  );
}
