"use client";

import { useState, useEffect } from "react";
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

export default function CertificateValidation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!searchTerm) return; // Jika tidak ada input, tidak perlu fetch data

      try {
        setLoading(true);

        // Menentukan jenis pencarian berdasarkan format input
        const queryParams = new URLSearchParams();

        if (searchTerm.includes("-")) {
          // Jika input seperti tanggal (misalnya, '2025-04-29')
          const date = new Date(searchTerm);
          if (!isNaN(date)) {
            queryParams.append("issued_date", searchTerm); // Anggap input tanggal adalah issued_date
          } else {
            queryParams.append("expired_date", searchTerm); // Jika tidak, anggap expired_date
          }
        } else if (/[a-zA-Z]/.test(searchTerm)) {
          // Jika input mengandung huruf, anggap itu fullname atau training_name
          queryParams.append("fullname", searchTerm);
          queryParams.append("training_name", searchTerm); // Bisa juga dicari di nama training
        }

        // Ambil data berdasarkan query params yang sudah dibangun
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/api/certificate/search?${queryParams.toString()}`
        );
        const result = await res.json();
        // Pastikan data sudah ada sebelum di-set
        if (result.status === "success" && Array.isArray(result.data)) {
          setCertificates(result.data); // Menyimpan data sertifikat
        } else {
          setCertificates([]); // Jika tidak ada data atau error
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]); // Set data kosong jika terjadi error
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [searchTerm]); // Menjalankan fetch tiap kali searchTerm berubah

  return (
    <div className="max-w-screen mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Certificate Validation
      </h1>

      <div className="relative flex items-center mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Type your name or ID here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Menangani perubahan input
          className="w-full p-2 border border-secondBlue placeholder:text-mainOrange shadow-lg rounded-full pl-4"
        />
        <FaSearch className="absolute right-4 text-orange-500" />
      </div>

      {/* Menampilkan loading atau data kosong */}
      {loading && searchTerm.trim() !== "" && (
        <div className="text-center mt-10">Loading...</div>
      )}

      {/* Menampilkan data kosong jika searchTerm tidak ditemukan */}
      {searchTerm === "" && !loading && (
        <div className="text-center mt-10 min-h-screen">
          <img
            src="/assets/no-data.png"
            alt="No Data"
            className="mx-auto w-64"
          />
          <p className="text-gray-600 mt-4">
            Please enter your name or ID to search for certificates.
          </p>
        </div>
      )}

      {/* Menampilkan data sertifikat */}
      {!loading && searchTerm.trim() !== "" && (
        <div className="overflow-x-auto mt-8 px-4">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Expired Date</TableHead>
                <TableHead>Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.certificate_number}</TableCell>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>
                    {new Date(item.issued_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.training_name}</TableCell>
                  <TableCell>
                    {new Date(item.expired_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${
                      item.status_certificate === "Valid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.status_certificate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && searchTerm.trim() !== "" && certificates.length === 0 && (
        <div className="text-center">
          <NotFound
            message="We couldn’t find any data matching your search. Try different keywords."
            buttons={[]}
          />
        </div>
      )}
    </div>
  );
}
