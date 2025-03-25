import React from "react";
import { FaEdit, FaTrash, FaEye, FaShapes } from "react-icons/fa";

const ArticleCard = ({ title, description, category, views, imageUrl }) => {
    const truncatedDescription = description.length > 100 ? description.slice(0, 120) + "..." : description;

    return (
        <div className="w-full max-w-[666px] border-2 border-mainBlue rounded-lg p-4 flex gap-4 shadow-[8px_8px_0px_0px_#157ab2] relative bg-white">
            {/* Image + Category & Views */}
            <div className="flex flex-col items-center w-{40%} h-full">
                {/* Image */}
                <div className="flex-1 w-full rounded-[10px] overflow-hidden">
                    <img src={imageUrl} alt="Article" className="w-full h-full object-cover" />
                </div>

                {/* Category & Views - Moved Below Image */}
                <div className="flex items-center justify-center w-full text-mainBlack text-[clamp(10px,1vw,14px)] mt-2 gap-4">
                    <span className="flex items-center">
                        <span className="text-mainOrange mr-2"><FaShapes /></span> {category}
                    </span>
                    <span className="flex items-center">
                        <span className="text-mainOrange mr-2"><FaEye /></span> {views}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                {/* Title */}
                <h2 className="text-mainBlack font-montserrat font-medium text-[clamp(14px,1.8vw,28px)] leading-tight mb-2 text-justify">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-mainBlack font-montserrat text-[clamp(12px,1.5vw,20px)] mb-10 text-justify">
                    {truncatedDescription}
                </p>
            </div>

            {/* Actions */}
            <div className="absolute bottom-2 right-4 flex space-x-4 mt-4">
                <button className="flex items-center bg-lightBlue text-white px-3 py-1 sm:px-6 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-mainBlue hover:text-white gap-2">
                    <FaEdit /> Edit
                </button>
                <button className="text-error1 p-2 rounded-md hover:bg-error1 hover:text-white">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default ArticleCard;
