"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { NotFound } from "../../../../components/ui/ErrorPage";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

const formatDate = (isoString) => {
  if (!isoString) return "No Expiry Date";

  const date = new Date(isoString);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleString("en-US", options).replace(",", ",");
};

export default function CertificateValidation() {
  const [inputValue, setInputValue] = useState(""); // Text input value
  const [searchTerm, setSearchTerm] = useState(""); // Term used to query API
  const [certificates, setCertificates] = useState([]); // Result from API
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Current page
  const debounceRef = useRef(null);

  // Trigger search on Enter key
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  // Auto-search with debounce (1.5s delay)
  useEffect(() => {
    if (inputValue.trim() === "") return;

    debounceRef.current = setTimeout(() => {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }, 1500);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  // Fetch certificate data based on search term
  useEffect(() => {
    const fetchCertificates = async () => {
      if (!searchTerm) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/search?q=${searchTerm}`
        );
        const result = await res.json();
        setCertificates(result?.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [searchTerm]);

  // Pagination setup
  const totalPages = Math.ceil(certificates.length / PAGE_SIZE);
  const paginatedData = certificates.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="max-w-screen mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Certificate Validation
      </h1>

      {/* Search Input */}
      <div className="relative flex items-center mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Type your name, date, or certificate number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full p-2 border border-secondBlue shadow-lg rounded-full pl-4 
             placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base 
             placeholder:text-mainOrange"
        />
        <FaSearch className="absolute right-4 text-orange-500" />
      </div>

      {/* Loading state */}
      {loading && searchTerm !== "" && (
        <div className="text-center mt-10">Loading...</div>
      )}

      {/* No search term */}
      {searchTerm === "" && !loading && (
        <div className="text-center mt-10 min-h-screen">
          <img
            src="/assets/no-data.png"
            alt="No Data"
            className="mx-auto w-64"
          />
          <p className="text-gray-600 mt-4">
            Please enter your name or certificate number to search.
          </p>
        </div>
      )}

      {/* Search results */}
      {!loading && searchTerm !== "" && paginatedData.length > 0 && (
        <>
          <div className="overflow-x-auto mt-8">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Certificate Title</TableHead>
                  <TableHead>Expired Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.certificate_number}</TableCell>
                    <TableCell>{item.fullname}</TableCell>
                    <TableCell>
                      {formatDate(item.issued_date)}
                    </TableCell>
                    <TableCell>{item.certificate_title}</TableCell>
                    <TableCell>
                      {formatDate(item.expired_date)}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${item.validity_status === "Valid"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {item.validity_status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 border-mainOrange text-mainOrange hover:bg-mainOrange hover:text-white"
                        onClick={() =>
                          window.open(
                            `/certificate/${item.certificate_number}`,
                            "_blank"
                          )
                        }
                      >
                        See Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Pagination info */}
          <div className="text-xs text-gray-600 text-center mt-2">
            Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, certificates.length)} of{" "}
            {certificates.length} data
          </div>
        </>
      )}

      {/* Not found state */}
      {!loading && searchTerm !== "" && paginatedData.length === 0 && (
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
