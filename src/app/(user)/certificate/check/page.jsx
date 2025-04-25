"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { NotFound } from "../../../../components/ui/ErrorPage";

const dummyData = [
  {
    id: "ID00000001",
    name: "John Doe",
    issued: "20 Nov 2024",
    course: "Rorem ipsum dolor sit amet, consectetur adipiscing elit.",
    expired: "20 Nov 2026",
    status: "Valid",
  },
  {
    id: "ID00000002",
    name: "Jane Smith",
    issued: "15 Oct 2023",
    course: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    expired: "15 Oct 2025",
    status: "Expired",
  },
  {
    id: "ID00000003",
    name: "Michael Brown",
    issued: "05 Sep 2022",
    course: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expired: "05 Sep 2024",
    status: "Valid",
  },
  {
    id: "ID00000004",
    name: "Emily Davis",
    issued: "10 Jan 2021",
    course: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    expired: "10 Jan 2023",
    status: "Expired",
  },
];

export default function CertificateValidation() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dummyData.filter(
    (item) =>
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
        <div className="text-center mt-10 min-h-screen">
          <img src="/assets/no-data.png" alt="No Data" className="mx-auto w-64" />
          <p className="text-gray-600 mt-4">
            Please enter your name or ID to search for certificates.
          </p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="overflow-x-auto mt-8 px-4">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Expired Date</TableHead>
                <TableHead>Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.issued}</TableCell>
                  <TableCell>{item.course}</TableCell>
                  <TableCell>{item.expired}</TableCell>
                  <TableCell
                    className={`font-semibold ${item.status === "Valid" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {item.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center">
          <NotFound message="We couldn’t find any data matching your search. Try different keywords." buttons={[]} />
        </div>
      )}
    </div>
  );
}