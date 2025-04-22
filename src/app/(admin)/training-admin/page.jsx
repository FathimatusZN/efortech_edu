"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TrainingPage() {
  const router = useRouter();
  const [trainingData, setTrainingData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/training");
        const data = await res.json();
        if (res.ok) {
          setTrainingData(data.data); // Pastikan ini sesuai struktur backend
        }
      } catch (err) {
        console.error("Failed to fetch training data:", err);
      }
    };

    fetchTrainings();
  }, []);

  const filteredData = trainingData
    .filter((item) =>
      (filterStatus === "All" || item.status === filterStatus) &&
      (item.training_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "Latest" ? b.id - a.id : a.id - b.id
    );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatRupiah = (value) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col justify-start w-full max-w-screen mx-auto min-h-screen px-8 pb-12">
     <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 px-4">
        <h2 className="text-2xl font-bold">Training & Courses</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm w-full pl-6 pr-10 py-2 rounded-xl border-2 border-mainOrange focus:ring-0 focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] border-2 border-mainOrange rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[130px] border-2 border-mainOrange rounded-xl">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>

                <Button
                  variant="mainBlue"
                  size="sm"
                  onClick={() => router.push("/training-admin/add")}
                >
                  <Plus size={16} /> Add New
                </Button> 
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {paginatedData.map((training) => {
          const isArchived = training.status !== "Active";
          const badgeClass = isArchived
            ? "text-gray-500 border-gray-400"
            : "text-mainOrange border-mainOrange";
          const cardClass = isArchived
            ? "bg-gray-50 border-gray-300"
            : "border-gray-200";

          return (
            <div
              key={training.id}
              className={`border shadow-lg rounded-2xl overflow-hidden flex flex-col cursor-pointer w-full h-[430px] max-w-sm ${cardClass}`}
            >
              <div className="h-[200px] w-full relative">
              {training.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-[2px] rounded-full shadow-md animate-bounce">
                  🔥 {Math.round(
                    ((training.training_fees - training.discount) / training.training_fees) * 100
                  )}% OFF
                </div>
              )}
                <img
                  src={training.images?.[0] || "/fallback.jpg"}
                  alt={training.training_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow p-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                    {training.training_name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-4">
                    {training.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-3 py-1 rounded-lg font-semibold text-sm border ${badgeClass}`}
                    >
                      {training.status}
                    </span>

                    {training.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500 line-through border px-3 py-1 rounded-lg">
                          {formatRupiah(training.training_fees)}
                        </span>
                        <span className="text-sm font-bold text-mainOrange px-3 py-1 border border-mainOrange rounded-lg ml-2">
                          {formatRupiah(training.discount)}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-lg font-semibold text-sm border ${badgeClass}`}
                      >
                        {formatRupiah(training.training_fees)}
                      </span>
                    )}
                  </div>

                  <ArrowRight
                    className="text-gray-600 hover:text-mainOrange transition-all"
                    onClick={() =>
                      router.push(`/training-admin/${training.id}`)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* === PAGINATION === */}
      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <p className="text-sm text-muted-foreground mt-2 flex justify-center items-center">
          Showing {filteredData.length > 0
            ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredData.length)}`
            : 0
          } of {filteredData.length} training data
        </p>

    </div>
  );
}