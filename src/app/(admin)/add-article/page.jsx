"use client";
import { useState, useRef } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TextEditor from "../../../components/admin/TextEditor";
import { PageTitle, SaveButton, DiscardButton, InputField, SelectDropdown, ImageUploader, AddLabel, SourcesInput } from "@/components/layout/InputField";

export default function AddArticle() {
    // State for managing sources list
    const [sources, setSources] = useState([{ previewText: "", link: "" }]);

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
                            <ImageUploader className="mt-2" maxImages={3} />
                        </div>
                    </div>

                    {/* Content Editor Section */}
                    <label className="font-semibold mt-2 block">Content <span className="text-error1">*</span></label>
                    <TextEditor className="mt-2 " />

                    {/* Sources Input Section */}
                    <label className="font-semibold mt-6 block">Sources</label>
                    <SourcesInput sources={sources} setSources={setSources} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
