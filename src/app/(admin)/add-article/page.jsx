"use client";
import { useState, useRef } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TextEditor from "../../../components/admin/TextEditor";
import { FaEdit, FaPlus, FaTrash, FaCloudUploadAlt, FaTimes, FaLink, FaChevronDown } from "react-icons/fa";
import { PageTitle, SaveButton, DiscardButton, AddPageHeader, InputField, SelectDropdown, ImageUploader, AddLabel } from "@/components/layout/InputField";

export function SourcesInput({ sources, addSource, removeSource }) {
    return (
        <div>
            {sources.map((_, index) => (
                <div key={index} className="flex items-center text-sm gap-2 mt-2">
                    {/* Input untuk Preview Text */}
                    <input
                        type="text"
                        placeholder="Text Preview"
                        className="w-2/3 p-2 text-[14px] rounded-md shadow-[0px_4px_4px_rgba(21,122,178,0.25)]"
                    />

                    {/* Input untuk Link */}
                    <div className="relative w-1/3">
                        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral3" />
                        <input
                            type="text"
                            placeholder="Enter a link"
                            className="w-full p-2 pl-9 text-[14px] rounded-md shadow-[0px_4px_4px_rgba(21,122,178,0.25)] text-lightBlue"
                        />
                    </div>

                    {/* Tombol Hapus */}
                    <button
                        className="bg-error1 text-white p-1 rounded-full hover:bg-mainOrange transition"
                        onClick={() => removeSource(index)}
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            ))}

            {/* Tombol Tambah Source */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={addSource}
                    className="bg-lightBlue text-white flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-mainBlue transition"
                >
                    <FaPlus size={16} /> Add More Sources
                </button>
            </div>
        </div>
    );
}

export default function AddArticle() {
    // State for managing sources list
    const [sources, setSources] = useState([""]);

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mb-2 gap-4">
                    <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-4 gap-4">
                        {/* Title */}
                        <PageTitle title="Add New Article" />

                        {/* Save & Discard Button */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            {/* Save Button */}
                            <SaveButton />

                            {/* Discard Button */}
                            <DiscardButton />
                        </div>
                    </div>
                </div>

                {/* Main Article Form */}
                <div className="outline outline-3 outline-mainBlue p-6 bg-white shadow-md rounded-lg border w-full">
                    {/* Article Title Input */}
                    <InputField label="Title" placeholder="Type title here.." required className="mt-2" />

                    {/* Category and Tags Section */}
                    <div className="flex flex-wrap md:flex-nowrap gap-8 mt-2">
                        <div className="w-full md:w-[40%] flex flex-col space-y-4">
                            {/* Category Dropdown */}
                            <SelectDropdown label="Category" required className="mt-2">
                                <option>Education</option>
                                <option>Event</option>
                                <option>Success Case</option>
                            </SelectDropdown>

                            {/* Tags Input Component */}
                            <AddLabel
                                className="mt-2"
                                label="Tags"
                                placeholder="Tags"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="w-full md:w-[60%] flex flex-col space-y-2">
                            <ImageUploader className="mt-2" maxImages={4} />
                        </div>
                    </div>

                    {/* Content Editor Section */}
                    <label className="font-semibold mt-2 block">Content <span className="text-error1">*</span></label>
                    <TextEditor className="mt-2 " />

                    {/* Sources Input Section */}
                    <label className="font-semibold mt-6 block">Sources</label>
                    <SourcesInput
                        sources={sources}
                        addSource={() => setSources([...sources, ""])}
                        removeSource={(index) => setSources(sources.filter((_, i) => i !== index))}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
