"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import { NotFound } from "@/components/ui/ErrorPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TrainingPage() {
  const router = useRouter();
  const [trainingData, setTrainingData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
    // Setup a delay to debounce the search query input
    const delayDebounce = setTimeout(() => {
      const fetchTrainings = async () => {
        setIsLoading(true);
        try {
          // Build query params based on current filter/sort/search state
          const params = new URLSearchParams();

          // Filter by status (convert to backend expected value)
          if (filterStatus !== "All") {
            params.append("status", filterStatus === "Active" ? "1" : "2");
          } else {
            params.append("status", "all");
          }

          // Add search query if it's not empty
          if (searchQuery) {
            params.append("search", searchQuery);
          }

          // Add sort params
          if (sortOrder === "Latest") {
            params.append("sort_by", "created_date");
            params.append("sort_order", "desc");
          } else {
            params.append("sort_by", "created_date");
            params.append("sort_order", "asc");
          }

          // Make API call with constructed query params
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training?${params.toString()}`
          );

          const data = await res.json();

          // Update state with fetched data
          if (res.ok) {
            setTrainingData(data.data);
          }
        } catch (err) {
          console.error("Failed to fetch training data:", err);
        } finally {
          setIsLoading(false);
        }
      };

      // Call the fetch function after debounce delay
      fetchTrainings();
    }, 500); // Wait for 500ms before calling API (debounce)

    // Clear timeout if any of the dependencies change before the delay completes
    return () => clearTimeout(delayDebounce);
  }, [filterStatus, sortOrder, searchQuery]); // Rerun effect when filters or search change

  const totalPages = Math.ceil(trainingData.length / itemsPerPage);
  const paginatedData = trainingData.slice(
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
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="flex flex-col justify-start w-full max-w-screen mx-auto min-h-screen pb-12 px-2 sm:px-4 md:px-8">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 px-4">
          <h2 className="text-2xl font-bold">Training & Courses</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm w-full pl-6 h-10 pr-10 py-2 rounded-md border-2 border-mainOrange focus:ring-0 focus:outline-none"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] h-10 border-2 border-mainOrange rounded-md focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[150px] h-10 border-2 border-mainOrange rounded-md focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="mainBlue"
                onClick={() => router.push("/training-admin/add")}
              >
                <Plus size={20} /> Add New
              </Button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => {
              const isArchived = item.status !== 1; // 1 = Active, sesuai backend
              const badgeClass = isArchived
                ? "text-gray-500 border-gray-400"
                : "text-mainOrange border-mainOrange";
              const cardClass = isArchived
                ? "bg-gray-50 border-gray-300"
                : "border-gray-200";

              const fee = parseFloat(item.training_fees);
              const discount = parseFloat(item.discount);
              const finalPrice = item.final_price || (fee - (discount / 100) * fee);

              return (
                <div
                  key={item.training_id}
                  className={`border shadow-lg rounded-2xl overflow-hidden flex flex-col cursor-pointer w-full h-[430px] max-w-sm ${cardClass}`}
                  onClick={() => router.push(`/training-admin/${item.training_id}`)}
                >
                  <div className="h-[200px] w-full relative">
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-[2px] rounded-full shadow-md animate-bounce">
                        🔥 {discount}% OFF
                      </div>
                    )}
                    <img
                      src={item.images?.[0] || "/fallback.jpg"}
                      alt={item.training_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-grow p-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                        {item.training_name}
                      </h2>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-4">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <div className="flex gap-2 items-center">
                        <span
                          className={`px-3 py-1 rounded-lg font-semibold text-sm border ${badgeClass}`}
                        >
                          {item.status === 1 ? "Active" : "Archived"}
                        </span>

                        {discount > 0 ? (
                          <div className="flex items-center gap-1 border border-mainOrange px-3 py-[4px] rounded-md">
                            <span className="text-xs text-gray-400 line-through">
                              {formatRupiah(fee)}
                            </span>
                            <span className="text-sm font-semibold text-mainOrange">
                              {formatRupiah(finalPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="px-3 py-1 rounded-md font-semibold text-sm border border-mainOrange text-mainOrange">
                            {formatRupiah(fee)}
                          </span>
                        )}
                      </div>

                      <ArrowRight
                        className="text-gray-600 hover:text-mainOrange transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <NotFound
                message={
                  searchQuery
                    ? "No training found for your search. Try different keywords."
                    : "No training data found for this filter."
                }
                buttons={[]}
              />
            </div>
          )}

        </div>

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
          Showing {trainingData.length > 0
            ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, trainingData.length)}`
            : 0
          } of {trainingData.length} training data
        </p>
      </div>
    </ProtectedRoute>
  );
}