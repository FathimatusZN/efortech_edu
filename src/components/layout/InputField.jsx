import { FaEdit, FaTrash, FaChevronDown, FaCloudUploadAlt, FaPlus, FaTimes, FaLink } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

// Reusable Title Component
const PageTitle = ({ title }) => {
    return <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>;
};

// Save Button Component
export const SaveButton = ({ onClick, disabled = false }) => {
    return (
        <button
            className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow transition-colors duration-200
                ${disabled
                    ? "bg-neutral2 text-neutral4 cursor-not-allowed"
                    : "bg-mainBlue text-white hover:bg-lightBlue"}`}
            onClick={onClick}
            disabled={disabled}
        >
            <FaEdit />
            <span>Save</span>
        </button>
    );
};

// Discard Button Component
export const DiscardButton = ({ onClick }) => {
    const handleClick = () => {
        const confirmReset = window.confirm("Are you sure you want to discard all changes?");
        if (confirmReset) onClick();
    };

    return (
        <button
            className="flex items-center gap-2 bg-neutral2 text-neutral3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow hover:bg-error1 hover:text-white"
            onClick={handleClick}
        >
            <FaTrash />
            <span>Discard</span>
        </button>
    );
};

// Header Component for New Page
const AddPageHeader = ({ title, onSave, onDiscard }) => {
    return (
        <div className="flex flex-wrap justify-between items-center w-full max-w-[1440px] mx-auto mt-6 mb-4 gap-4">
            <PageTitle title={title} />
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <SaveButton onClick={onSave} />
                <DiscardButton onClick={onDiscard} />
            </div>
        </div>
    );
};

// Input Field Component
const InputField = ({ label, placeholder, required, className, value, onChange }) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="font-semibold mb-1">
                    {label} {required && <span className="text-error1">*</span>}
                </label>
            )}
            <input
                type="text"
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                className="p-2 border rounded-md outline outline-1 outline-mainBlue focus:ring-1 focus:ring-mainBlue"
            />
        </div>
    );
};

// Select Component
const SelectDropdown = ({ label, required, children, className, value, onChange }) => {
    return (
        <div className={`flex flex-col relative ${className}`}>
            {label && (
                <label className="font-semibold mb-1">
                    {label} {required && <span className="text-error1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 pr-8 border rounded-md outline outline-1 outline-mainBlue focus:ring-1 focus:ring-mainBlue appearance-none">
                    {children}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mainBlue pointer-events-none" />
            </div>
        </div>
    );
};

// Image Uploader Component
const ImageUploader = ({ maxImages = 3, images, setImages }) => {
    const [previewImage, setPreviewImage] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            const newImages = [...images];
            newImages[index] = {
                base64,
                name: file.name,
                type: file.type,
                size: file.size,
            };
            setImages(newImages);
        }
    };

    const addImageSlot = () => {
        if (images.length < maxImages) {
            setImages([...images, null]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            <label className="font-semibold">Image *</label>
            <div className="flex gap-4 flex-wrap mt-1.5">
                {images.map((image, index) => (
                    <div key={index} className="relative w-[30%]">
                        <label className="cursor-pointer flex flex-col items-center justify-center outline-1 outline-dashed outline-mainBlue rounded-md w-full h-32">
                            {image ? (
                                <>
                                    <img
                                        src={image.base64}
                                        alt="Uploaded"
                                        className="w-full h-full object-cover rounded-md"
                                        onClick={() => setPreviewImage(image.base64)}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="absolute top-2 right-2 bg-error1 text-white p-1 rounded-full hover:bg-white hover:text-error1"
                                    >
                                        <FaTrash />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <FaCloudUploadAlt className="text-mainOrange text-6xl mb-2" />
                                    <span className="text-sm text-gray-500">Upload image</span>
                                </>
                            )}
                            <input type="file" className="hidden" onChange={(e) => handleUpload(e, index)} />
                        </label>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        className="w-[30%] flex flex-col items-center justify-center p-4 cursor-pointer outline-1 outline-dashed outline-mainBlue rounded-md h-32"
                        onClick={addImageSlot}
                    >
                        <div className="bg-mainOrange text-white p-4 rounded-md">
                            <FaPlus className="text-2xl" />
                        </div>
                        <span className="text-sm text-gray-500 mt-2">Add more</span>
                    </div>
                )}
            </div>

            {/* Modal Preview */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="relative bg-white p-4 rounded-lg">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
                        >
                            <FaTimes />
                        </button>
                        <img src={previewImage} alt="Preview" className="max-w-[90vw] max-h-[80vh] rounded-md" />
                    </div>
                </div>
            )}
        </div>
    );
};

// Add Label Component
const AddLabel = ({ label = "Labels", placeholder = "Enter label", onChange, value }) => {
    const [labels, setLabels] = useState([""]);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (Array.isArray(value)) {
            setLabels(value.length > 0 ? value : [""]);
        }
    }, [value]);

    // Fungsi untuk menghitung lebar input berdasarkan teks
    const calculateWidth = (text, placeholder) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "14px sans-serif"; // Sesuaikan dengan font yang digunakan

        // Hitung lebar teks atau placeholder
        const textWidth = context.measureText(text || placeholder).width;
        return Math.max(25, textWidth + 10); // 25px minimal, tambahkan padding
    };

    const handleLabelChange = (index, value) => {
        const newLabels = [...labels];
        newLabels[index] = value;
        setLabels(newLabels);
        onChange && onChange(newLabels);
    };

    const addLabel = () => {
        if (labels[labels.length - 1] !== "") {
            setLabels([...labels, ""]);
        }
    };

    const removeLabel = (index) => {
        setLabels(labels.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter" && labels[index] !== "") {
            e.preventDefault(); // Hindari newline di input
            addLabel();
        }
    };

    // Fokus otomatis ke input terakhir setelah labels berubah
    useEffect(() => {
        if (labels.length > 1) {
            setTimeout(() => inputRefs.current[labels.length - 1]?.focus(), 0);
        }
    }, [labels]);

    return (
        <div className="flex flex-col space-y-2">
            <label className="font-semibold">{label}</label>
            <div className="flex flex-wrap gap-2">
                {labels.map((text, index) => (
                    <div
                        key={index}
                        className="relative flex items-center px-2 py-1 border rounded-md outline outline-1 outline-mainBlue text-sm"
                    >
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => handleLabelChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            placeholder={placeholder}
                            className="outline-none bg-transparent text-sm placeholder-gray-400"
                            style={{ width: `${calculateWidth(text, placeholder)}px` }}
                        />
                        <button className="text-mainOrange ml-1" onClick={() => removeLabel(index)}>
                            <FaTimes />
                        </button>
                    </div>
                ))}
                <button
                    onClick={addLabel}
                    className="flex items-center px-2 py-1 border rounded-md outline outline-1 outline-mainBlue text-sm text-mainBlue"
                >
                    <FaPlus />
                </button>
            </div>
        </div>
    );
};

const SourcesInput = ({ sources, setSources }) => {
    // Menambahkan source baru
    const addSource = () => {
        setSources([...sources, { preview_text: "", source_link: "" }]);
    };

    // Menghapus source berdasarkan index
    const removeSource = (index) => {
        setSources(sources.filter((_, i) => i !== index));
    };

    // Mengupdate nilai input
    const updateSource = (index, key, value) => {
        const newSources = sources.map((source, i) =>
            i === index ? { ...source, [key]: value } : source
        );
        setSources(newSources);
    };

    return (
        <div>
            {sources.map((source, index) => (
                <div key={index} className="flex items-center text-sm gap-2 mt-2">
                    {/* Input untuk Preview Text */}
                    <input
                        type="text"
                        placeholder="Text Preview"
                        value={source.preview_text}
                        onChange={(e) => updateSource(index, "preview_text", e.target.value)}
                        className="w-3/5 p-2 text-[14px] rounded-md shadow-[0px_4px_4px_rgba(21,122,178,0.25)]"
                    />

                    {/* Input untuk Link */}
                    <div className="relative w-2/5">
                        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral3" />
                        <input
                            type="text"
                            placeholder="Enter a link"
                            value={source.source_link}
                            onChange={(e) => updateSource(index, "source_link", e.target.value)}
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

export { PageTitle, SaveButton, DiscardButton, AddPageHeader, InputField, SelectDropdown, ImageUploader, AddLabel, SourcesInput };
