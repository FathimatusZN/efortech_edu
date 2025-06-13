"use client";

import { useRef, useState, useEffect } from "react";

export default function PartnerSection({ partnersData }) {
  const [selectedCategory, setSelectedCategory] = useState("College");

  const repeatedPartners = [
    ...partnersData[selectedCategory],
    ...partnersData[selectedCategory],
    ...partnersData[selectedCategory],
  ];

  return (
    <div className="text-center">
      <h2 className="text-xl md:text-3xl font-bold text-black mt-10">
        Our Partner
      </h2>

      <div className="flex justify-center gap-6 my-4">
        {["College", "Institution"].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 min-w-[120px] border rounded-full shadow-lg ${
              selectedCategory === category
                ? "bg-mainBlue text-white"
                : "border-mainBlue"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-6xl mx-auto overflow-x-hidden px-4">
        <div className="flex gap-2 md:gap-6 mt-2 md:mt-4 pb-10 whitespace-nowrap animate-infinite-scroll">
          {[...repeatedPartners, ...repeatedPartners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="relative w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 group cursor-pointer flex justify-center items-center flex-shrink-0"
            >
              <div className="absolute bottom-[-28px] sm:bottom-[-30px] md:bottom-[-32px] left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-300 z-10">
                <div
                  className={`bg-white border-2 border-mainOrange text-mainOrange font-semibold py-0.5 sm:py-1 px-2 rounded-md text-center break-words w-fit shadow-md line-clamp-3 ${
                    partner.partner_name.length > 30
                      ? "text-[10px] sm:text-xs md:text-xs"
                      : "text-xs sm:text-xs md:text-sm"
                  } min-w-[130px]`}
                >
                  {partner.partner_name}
                </div>
              </div>

              <div className="absolute w-full h-20 sm:h-24 bottom-0 rounded-md overflow-hidden flex flex-col">
                <div className="h-1/2 bg-white w-full"></div>
                <div className="h-1/2 bg-gray-200 w-full"></div>
              </div>

              <div className="relative z-20 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-md shadow-md flex items-center justify-center">
                <img
                  src={partner.partner_logo || "/default-logo.png"}
                  alt={partner.partner_name}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
