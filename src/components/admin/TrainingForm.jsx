'use client';

import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { FaClock, FaMoneyBill, FaTag, FaCheckCircle, FaTimesCircle, FaPlusCircle, FaCloudUploadAlt, FaPlus, FaTrash } from 'react-icons/fa';

export default function TrainingForm({ onSubmit, onValidationChange, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    level: initialData.level || 'Beginner',
    duration: initialData.duration || '',
    fee: initialData.fee || '',
    discount: initialData.discount || '',
    validity: initialData.validity || '',
    status: initialData.status || false,
    terms: initialData.terms || ['', '', ''],
    skills: initialData.skills || ['', '', '', '', ''],
    images: initialData.images || [],
  });

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState(formData.images || []);
  const [previewImage, setPreviewImage] = useState(null);
  const [formIsValid, setIsValid] = useState(false);
  const maxImages = 3;

  useEffect(() => {
    setFormData(prev => ({ ...prev, images }));
  }, [images]);

  useEffect(() => {
    const isValid =
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.level.trim() !== '' &&
      formData.duration.trim() !== '' && !isNaN(formData.duration) &&
      formData.fee.trim() !== '' && !isNaN(formData.fee) &&
      (formData.discount === '' || !isNaN(formData.discount)) &&
      formData.validity.trim() !== '' && !isNaN(formData.validity) &&
      formData.skills.every(skill => skill.trim() !== '') &&
      formData.terms.every(term => term.trim() !== '') &&
      images.length > 0;

    setIsValid(isValid);
    onValidationChange?.(isValid);
  }, [formData, images, onValidationChange]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;

    if (['duration', 'fee', 'validity', 'discount'].includes(name)) {
      if (value !== '' && isNaN(value)) {
        setErrors((prev) => ({ ...prev, [name]: 'This field must be a number' }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked) => {
    setFormData({ ...formData, isActive: checked });
  };

  const handleSkillChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData({ ...formData, skills: updated });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ''] });
  };

  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

  const handleTermChange = (index, value) => {
    const updated = [...formData.terms];
    updated[index] = value;
    setFormData({ ...formData, terms: updated });
  };

  const addImageSlot = () => {
    if (images.length < maxImages) {
      setImages([...images, null]);
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...images];
        updated[index] = reader.result;
        setImages(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formIsValid =
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.level.trim() !== '' &&
      formData.duration.trim() !== '' && !isNaN(formData.duration) &&
      formData.fee.trim() !== '' && !isNaN(formData.fee) &&
      (formData.discount === '' || !isNaN(formData.discount)) &&
      formData.validity.trim() !== '' && !isNaN(formData.validity) &&
      formData.skills.every(skill => skill.trim() !== '') &&
      formData.terms.every(term => term.trim() !== '') &&
      images.length > 0;

    if (!formIsValid) {
      alert("Please fill all required fields correctly.");
      return;
    }

    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6 border-2 border-mainBlue rounded-xl shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:gap-6">
        <div className="w-full sm:w-[600px]">
          <label className="block text-lg font-semibold w-full">
            Training Name<span className="text-red-500"> *</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Type training name here"
              className="mt-2 w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
            />
          </label>
        </div>

        <div className="w-full sm:w-40">
        <label className="text-lg font-semibold block mb-1">Training Status</label>
        <div className="flex items-center justify-start gap-x-4 mb-1">
          <span className="text-sm text-gray-600 min-w-[70px] text-left">
            {formData.isActive ? 'Active' : 'Archived'}
          </span>
          <Switch
            checked={formData.isActive}
            onCheckedChange={handleSwitchChange}
            className="data-[state=checked]:bg-mainBlue bg-gray-300"
          />
        </div>
        </div>
      </div>
      
      <div className="w-full">
      <label className="block text-lg font-semibold w-full">
            Description<span className="text-red-500"> *</span></label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Type description here"
        className="mt-2 w-full border border-mainBlue p-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
        required
      />
      </div>
     
      <div className="w-full">
      <label className="block text-lg font-semibold w-full">
      Level<span className="text-red-500"> *</span></label>
        <div className="mt-2 flex gap-12">
          {['Beginner', 'Medium', 'Advanced'].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={formData.level === level}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${formData.level === level ? 'border-mainBlue' : 'border-gray-400'}
                `}>
                  <div className={`
                    w-3 h-3 rounded-full
                    ${formData.level === level ? 'bg-mainBlue' : 'bg-gray-300'}
                  `} />
                </div>
              </div>
              <span className="text-sm">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
        <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
          Training Duration<span className="text-red-500"> *</span>
        </label>
          <div className="mt-2 flex items-center gap-2">
            <FaClock className="text-mainBlue" size={24} />
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange2}
              placeholder="Duration in hours"
              className={`w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue ${
                  errors.duration ? 'border-red-500' : ''
                }`}
              required
            />
          </div>
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        <div className="relative">
        <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
          Training Fees<span className="text-red-500"> *</span>
        </label>

          <div className="mt-2 flex items-center relative gap-2">
            <FaMoneyBill className="text-mainBlue" size={24}/>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-sm">Rp</span>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                onChange={handleChange2}
                placeholder="e.g. 1500000"
                className={`w-full border border-mainBlue px-3 py-2 pl-10 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue ${
                  errors.fee ? 'border-red-500' : ''
                }`}
                required
              />
            </div>
          </div>
          {errors.fee && (
            <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
          )}
        </div>

        <div>
        <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
          Discount</label>
          <div className="mt-2 flex items-center gap-2">
            <FaTag className="text-mainBlue" size={24} />
            <div className="relative w-full">
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange2}
                placeholder="0-100"
                className={`w-full border border-mainBlue px-3 py-2 pr-8 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue ${
                  errors.discount ? 'border-red-500' : ''
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-sm font-semibold pointer-events-none">
                %
              </span>
            </div>
          </div>
          {errors.discount && (
            <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
          )}
        </div>

        <div>
        <label className="block text-[clamp(12px,2.5vw,18px)] font-semibold mb-1">
          Certificate Validity Period<span className="text-red-500"> *</span>
        </label>
          <div className="mt-2 flex items-center gap-2">
            <FaCheckCircle className="text-mainBlue" size={24} />
            <div className="relative w-full">
              <input
                type="text"
                name="validity"
                value={formData.validity}
                onChange={handleChange2}
                placeholder="Duration in months"
                className={`w-full border border-mainBlue px-3 py-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue ${
                  errors.validity ? 'border-red-500' : ''
                }`}
              />
            </div>
          </div>
          {errors.validity && (
            <p className="text-red-500 text-sm mt-1">{errors.validity}</p>
          )}
        </div>
      </div>

      <div className="w-full">
        <label className="block text-lg font-semibold w-full">
          Terms and Conditions<span className="text-red-500"> *</span>
        </label>
        <textarea
          name="terms"
          value={formData.terms.join('\n')} // ubah array jadi string
          onChange={(e) => {
            const lines = e.target.value.split('\n'); // ubah string jadi array
            setFormData({ ...formData, terms: lines });
          }}
          placeholder="Type term and condition here, one per line"
          className="mt-2 w-full border border-mainBlue p-2 rounded-md text-sm font-normal focus:outline-none focus:border-mainBlue"
          required
        />
      </div>


      <div className="grid md:grid-cols-2 gap-6">
        <div>
        <label className="block text-lg font-semibold mb-2">
          Skills Earned<span className="text-red-500"> *</span>
        </label>
        <div>
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(idx, e.target.value)}
                className="w-full border border-gray-300 shadow-sm shadow-mainBlue px-3 py-2 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-mainBlue"
                placeholder="Add skill"
                required
              />
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-red-500 hover:text-red-600"
                title="Remove Skill"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
          ))}
          
          <Button
            type="button"
            onClick={addSkill}
            variant="mainBlue"
            size="sm"
            className="mt-4 mb-8"
          >
            <FaPlusCircle />
            Add More Skills
          </Button>
        </div>
      </div>

      <div className="mt-4">
      <label className="block text-lg font-semibold mb-1">Images</label>
      <div className="flex gap-4 flex-wrap mt-1.5">
      {images.map((image, index) => (
  <div key={index} className="relative w-[30%] h-32">
    <div
      className="cursor-pointer flex items-center justify-center outline outline-2 outline-dashed outline-mainBlue rounded-md w-full h-full overflow-hidden"
      onClick={() => setPreviewImage(image)}
    >
      {image ? (
        <img
          src={image}
          alt={`Preview ${index}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <FaCloudUploadAlt className="text-5xl mb-2" />
          <span className="text-sm">Upload image</span>
        </div>
      )}
    </div>

    {/* Tombol hapus */}
    <button
      type="button"
      onClick={() => removeImage(index)}
      className="absolute top-2 right-2 bg-error1 text-white p-1 rounded-full hover:bg-white hover:text-error1"
    >
      <FaTrash />
    </button>

    {/* Input file tersembunyi */}
    <input
      type="file"
      className="hidden"
      id={`file-${index}`}
      onChange={(e) => handleUpload(e, index)}
    />
    {/* Trigger input pakai label terpisah */}
    {!image && (
      <label
        htmlFor={`file-${index}`}
        className="absolute inset-0 cursor-pointer"
      />
    )}
  </div>
))}
        {images.length < maxImages && (
          <div
            className="w-[30%] flex flex-col items-center justify-center p-4 cursor-pointer outline outline-2 outline-dashed outline-mainBlue rounded-md h-32"
            onClick={addImageSlot}
          >
            <div className="bg-mainOrange text-white p-4 rounded-md">
              <FaPlus className="text-2xl" />
            </div>
            <span className="text-sm text-gray-500 mt-2">Add more</span>
          </div>
        )}

        {images.map((_, index) => (
          <input
            key={`input-${index}`}
            type="file"
            className="hidden"
            onChange={(e) => handleUpload(e, index)}
          />
        ))}
      </div>

      {/* Modal Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="bg-white p-4 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto shadow-lg relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto object-contain rounded"
            />
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
    </form>
  );
}
