"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useMemo } from "react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaSearch } from "react-icons/fa";

const dummyCertificates = Array.from({ length: 25 }, (_, i) => ({
  id: `ID${String(i + 1).padStart(5, "0")}`,
  name: `User ${i + 1}`,
  certName: `Certificate ${i + 1}`,
  certNumber: `CERT-${i + 1000}`,
  issued: `2024-01-${(i % 28) + 1}`,
  expired: `2025-01-${(i % 28) + 1}`,
  status: i % 3 === 0 ? "Expired" : "Active",
  notes: i % 4 === 0 ? "Almost Expired" : "",
}));

const Certificate = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return dummyCertificates.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.certName.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All Statuses" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="max-w-screen-xl mx-auto p-8 space-y-6">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold mr-auto">Certificates</h1>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="w-full sm:w-80 border-2 border-mainOrange rounded-md flex items-center px-3 gap-2">
              <FaSearch className="text-black" />
              <Input
                type="text"
                placeholder="Search"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fullname</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Certification Name</TableHead>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Expired Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.name}</TableCell>
                  <TableCell>{cert.id}</TableCell>
                  <TableCell>{cert.certName}</TableCell>
                  <TableCell>{cert.certNumber}</TableCell>
                  <TableCell>{cert.issued}</TableCell>
                  <TableCell>{cert.expired}</TableCell>
                  <TableCell>{cert.status}</TableCell>
                  <TableCell>{cert.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </ProtectedRoute>
  );
};

export default Certificate;
