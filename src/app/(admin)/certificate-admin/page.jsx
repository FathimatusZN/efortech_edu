"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaSearch } from "react-icons/fa";

import { NotFound } from "@/components/ui/ErrorPage";

const PAGE_SIZE = 10;

const Certificate = () => {
  const [inputValue, setInputValue] = useState(""); // Input field value
  const [searchTerm, setSearchTerm] = useState(""); // Finalized search term
  const [certificates, setCertificates] = useState([]); // API result data
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Current page
  const [statusFilter, setStatusFilter] = useState("All Statuses"); // Selected filter
  const debounceRef = useRef(null);

  useEffect(() => {
    const fetchInitialCertificates = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates`);
        const result = await res.json();
        setCertificates(result?.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCertificates();
  }, []);

  // Handle search on Enter key
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  // Auto-search with debounce delay (1.5s)
  useEffect(() => {
    if (inputValue.trim() === "") return;

    debounceRef.current = setTimeout(() => {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }, 1500);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  // Fetch data from API based on searchTerm
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({ q: searchTerm });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/search?${queryParams}`
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

  // Filtered data based on status
  const filteredData = useMemo(() => {
    return certificates.filter((item) => {
      const matchStatus =
        statusFilter === "All Statuses" || item.validity_status === statusFilter;
      return matchStatus;
    });
  }, [certificates, statusFilter]);

  // Pagination logic based on filtered data
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="max-w-screen-xl mx-auto p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold mr-auto">Certificates</h1>

          <div className="flex items-center gap-3">
            {/* Status Filter Dropdown */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Valid">Valid</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="w-full h-[36px] sm:w-80 border-2 border-mainOrange rounded-md flex items-center px-3 gap-2">
              <FaSearch className="text-black" />
              <Input
                type="text"
                placeholder="Search"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && searchTerm !== "" && (
          <div className="text-center mt-10">Loading...</div>
        )}

        {/* Data Table */}
        {!loading && paginatedData.length > 0 && (
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.certificate_id}>
                      <TableCell>{item.certificate_number}</TableCell>
                      <TableCell>{item.fullname}</TableCell>
                      <TableCell>{new Date(item.issued_date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.certificate_title}</TableCell>
                      <TableCell>{new Date(item.expired_date).toLocaleDateString()}</TableCell>
                      <TableCell
                        className={`font-semibold ${item.validity_status === "Valid"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {item.validity_status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination UI */}
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            {/* Pagination Info */}
            <div className="text-xs text-gray-600 text-center mt-2">
              Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, filteredData.length)} of {filteredData.length} data
            </div>
          </>
        )}

        {/* No result state */}
        {!loading && paginatedData.length === 0 && (
          <div className="text-center">
            <NotFound
              message="We couldn’t find any data matching your search. Try different keywords."
              buttons={[]}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Certificate;
