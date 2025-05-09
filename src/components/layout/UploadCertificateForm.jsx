"use client";

import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineFilePdf, AiOutlineFileUnknown } from "react-icons/ai";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";

export default function UploadUCertificateForm({ onSubmit, variant = "user" }) {
    const inputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullname: "",
        cert_type: "",
        issuer: "",
        issued_date: "",
        expired_date: "",
        certificate_number: ""
    });

    const [certFile, setCertFile] = useState(null);
    const [certPreviewUrl, setCertPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const user = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user")) || {}
        : {};

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.fullname) {
                setFormData((prev) => ({ ...prev, fullname: parsedUser.fullname }));
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setErrors({});
        if (file) {
            if (file.type !== "application/pdf") {
                setErrors({ certFile: "Only PDF files are allowed." });
                return;
            }

            setLoading(true);
            try {
                const url = await uploadFile(file);
                setCertFile(file);
                setCertPreviewUrl(url);
            } catch (error) {
                setErrors({ certFile: error.message || "Upload failed." });
            } finally {
                setLoading(false);
            }
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("files", file);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ucertificate/upload-ucertificate`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();

        if (!res.ok || data.status !== "success") {
            throw new Error(data.message || "Upload failed.");
        }

        return data.data.fileUrl;
    };

    const handleSubmit = async () => {
        const requiredFields = ["fullname", "cert_type", "issuer", "issued_date", "expired_date", "certificate_number"];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace(/_/g, " ")} is required`;
            }
        });

        if (!certPreviewUrl) {
            newErrors.certFile = "PDF file is required";
        }

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            user_id: user.user_id,
            fullname: formData.fullname,
            cert_type: formData.cert_type,
            issuer: formData.issuer,
            issued_date: formData.issued_date,
            expired_date: formData.expired_date,
            certificate_number: formData.certificate_number,
            cert_file: certPreviewUrl,
        };

        if (user.role === "admin") {
            payload.user_id = null;
            payload.admin_id = user.user_id;
        }

        await onSubmit?.(payload);

        console.log("Final Payload:", payload);

        // Reset form
        setCertFile(null);
        setCertPreviewUrl("");
        setErrors({});
        setFormData({
            fullname: "",
            cert_type: "",
            issuer: "",
            issued_date: "",
            expired_date: "",
            certificate_number: "",
        });

        if (inputRef.current) {
            inputRef.current.value = ""; // reset file input value
        }
    };

    const renderFileIcon = () => {
        if (!certFile) return <AiOutlineFileUnknown className="text-gray-500 w-5 h-5" />;
        return <AiOutlineFilePdf className="text-red-500 w-5 h-5" />
    };

    return (
        <div className="grid md:grid-cols-2 gap-16 mt-6 max-w-full mx-auto px-4">
            {/* Left: File Upload */}
            <div className="space-y-4">
                <div>
                    <Label className="font-semibold">
                        Upload Certificate (PDF only) <span className="text-red-500">*</span>
                    </Label>

                    {!certFile || !certPreviewUrl ? (
                        <label className="cursor-pointer mt-2 flex flex-col items-center justify-center outline-2 outline-dashed outline-mainBlue rounded-md w-full h-80 transition hover:bg-blue-50">
                            <FaCloudUploadAlt className="text-mainBlue text-5xl mb-2" />
                            <span className="text-sm text-gray-500">Click to upload PDF</span>
                            <Input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={inputRef}
                            />
                        </label>
                    ) : (
                        <div className="mt-2 space-y-2 relative">
                            <div className="flex items-center gap-2">
                                {renderFileIcon()}
                                <a
                                    href={certPreviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm"
                                >
                                    {certFile.name}
                                </a>
                                <button
                                    onClick={() => {
                                        setCertFile(null);
                                        setCertPreviewUrl("");
                                    }}
                                    className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                    title="Remove file"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                            <embed
                                src={certPreviewUrl}
                                type="application/pdf"
                                className="w-full h-80 border rounded"
                            />
                        </div>
                    )}

                    {errors.certFile && (
                        <p className="text-sm text-red-500 mt-1">{errors.certFile}</p>
                    )}
                </div>
            </div>

            {/* Right: Form Fields */}
            <div className="space-y-4">
                {/* Fullname */}
                <div>
                    <Label>Fullname (According to the Certificate)</Label>
                    <Input
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Type your Fullname here"
                    />
                    {errors.fullname && (
                        <p className="text-sm text-red-500">{errors.fullname}</p>
                    )}
                </div>

                {/* Certificate Type */}
                <div>
                    <Label>Certificate Type</Label>
                    <Input
                        name="cert_type"
                        value={formData.cert_type}
                        onChange={handleChange}
                        placeholder="e.g. SCADA Course"
                    />
                    {errors.cert_type && (
                        <p className="text-sm text-red-500">{errors.cert_type}</p>
                    )}
                </div>

                {/* Issuer + Certificate Number in one row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Issued by</Label>
                        <Input
                            name="issuer"
                            value={formData.issuer}
                            onChange={handleChange}
                            placeholder="e.g. Efortech Solusi Integrasi"
                        />
                        {errors.issuer && (
                            <p className="text-sm text-red-500">{errors.issuer}</p>
                        )}
                    </div>
                    <div>
                        <Label>Certificate Number</Label>
                        <Input
                            name="certificate_number"
                            value={formData.certificate_number}
                            onChange={handleChange}
                            placeholder="Based on the Certificate File"
                        />
                        {errors.certificate_number && (
                            <p className="text-sm text-red-500">{errors.certificate_number}</p>
                        )}
                    </div>
                </div>

                {/* Issued Date + Expired Date in one row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Issued Date</Label>
                        <Input
                            name="issued_date"
                            type="date"
                            value={formData.issued_date}
                            onChange={handleChange}
                        />
                        {errors.issued_date && (
                            <p className="text-sm text-red-500">{errors.issued_date}</p>
                        )}
                    </div>
                    <div>
                        <Label>Expired Date</Label>
                        <Input
                            name="expired_date"
                            type="date"
                            value={formData.expired_date}
                            onChange={handleChange}
                        />
                        {errors.expired_date && (
                            <p className="text-sm text-red-500">{errors.expired_date}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <Button variant="lightBlue" className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Uploading..." : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
