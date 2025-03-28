"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const dummyData = [
  { id: "ID00000001", name: "John Doe", issued: "20 Nov 2024", course: "Rorem ipsum dolor sit amet, consectetur adipiscing elit.", expired: "20 Nov 2026", status: "Valid" },
  { id: "ID00000002", name: "Jane Smith", issued: "15 Oct 2023", course: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", expired: "15 Oct 2025", status: "Expired" },
  { id: "ID00000003", name: "Michael Brown", issued: "05 Sep 2022", course: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", expired: "05 Sep 2024", status: "Valid" },
  { id: "ID00000004", name: "Emily Davis", issued: "10 Jan 2021", course: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", expired: "10 Jan 2023", status: "Expired" },
];

export default function CertificateValidation() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = dummyData.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      {searchTerm === "" ? (
        <div className="text-center mt-20 min-h-screen">
          <img src="/assets/no-data.png" alt="No Data" className="mx-auto w-64" />
          <p className="text-gray-600 mt-4">Please enter your name or ID to search for certificates.</p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="overflow-x-auto px-20 mt-8">
          <table className="w-full border-separate border border-mainBlue rounded-xl overflow-hidden" style={{ borderSpacing: "0" }}>
            <thead>
              <tr className="bg-mainBlue text-white rounded-t-xl">
                <th className="border border-mainBlue p-2 first:rounded-tl-xl last:rounded-tr-xl">ID</th>
                <th className="border border-mainBlue p-2">Name</th>
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
                  <td className="border border-lightBlue p-2">{item.name}</td>
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
      ) : (
        <div className="text-center mt-20 min-h-screen">
          <img src="/assets/no-match.png" alt="No Match" className="mx-auto w-80" />
          <p className="text-gray-600 mt-4">Nothing matches the name or ID entered.</p>
        </div>
      )}
    </div>
  );
}