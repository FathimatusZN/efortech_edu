"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const dummyData = [
  { id: "ID00000001", issued: "20 Nov 2024", course: "Rorem ipsum dolor sit amet, consectetur adipiscing elit.", expired: "20 Nov 2026", status: "Valid" },
  { id: "ID00000002", issued: "15 Oct 2023", course: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", expired: "15 Oct 2025", status: "Expired" },
  { id: "ID00000003", issued: "05 Sep 2022", course: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", expired: "05 Sep 2024", status: "Valid" },
  { id: "ID00000004", issued: "10 Jan 2021", course: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", expired: "10 Jan 2023", status: "Expired" },
];

export default function CertificateValidation() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = dummyData.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-screen mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Certificate Validation</h1>
      
      <div className="relative flex items-center mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Type your name or ID here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-secondBlue placeholder:text-mainOrange shadow-lg rounded-full pl-4"
        />
        <FaSearch className="absolute right-4 text-orange-500" />
      </div>
      
      <div className="overflow-x-auto px-20 mt-8">
        <table className="w-full border-collapse rounded-full border border-mainBlue">
          <thead>
            <tr className="bg-mainBlue text-white">
              <th className="border border-mainBlue p-2">ID</th>
              <th className="border border-mainBlue p-2">Issued Date</th>
              <th className="border border-mainBlue p-2">Course Name</th>
              <th className="border border-mainBlue p-2">Expired Date</th>
              <th className="border border-mainBlue p-2">Validation</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-lightBlue p-2">{item.id}</td>
                <td className="border border-lightBlue p-2">{item.issued}</td>
                <td className="border border-lightBlue p-2">{item.course}</td>
                <td className="border border-lightBlue p-2">{item.expired}</td>
                <td
                  className={`border border-blue-600 p-2 font-semibold ${
                    item.status === "Valid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}