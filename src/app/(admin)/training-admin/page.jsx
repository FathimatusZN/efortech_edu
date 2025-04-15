"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function TrainingPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Terbaru");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const trainingData = [
    {
      id: 1,
      title: "WISE-4000 LAN Wireless / IO Module Series",
      image: "assets/gambar1.jpg",
      description: "Explore the latest wireless IO module series for industrial automation.",
      price: "Gratis",
      status: "Active",
    },
    {
      id: 2,
      title: "Mastering EdgeLink: IoT Gateway for Seamless OT-IT Integration",
      image: "assets/Gambar2.jpg",
      description: "Learn how to integrate IoT gateways with seamless OT-IT connectivity.",
      price: "300.000",
      discount: "200.000", // ← ini harga setelah diskon
      status: "Active",
    },    
    {
      id: 3,
      title: "Accelerating Digital O&M using DeviceOn/BI and Patrol Inspection",
      image: "https://source.unsplash.com/400x300/?circuit",
      description: "Enhance your operations with AI-powered digital maintenance.",
      price: "Rp250.000",
      status: "Active",
    },
    {
      id: 4,
      title: "Familiarize yourself with all functions in Advantech IoT Academy",
      image: "https://source.unsplash.com/400x300/?engineering",
      description: "A complete training program to understand IoT functions. A complete training program to understand IoT functions. A complete training program to understand IoT functions.",
      price: "Rp450.000",
      status: "Archived", 
    },
    {
      id: 5,
      title: "Industrial IoT Training and International Advantech",
      image: "https://source.unsplash.com/400x300/?industry",
      description: "Join our industrial IoT training for a better understanding of automation.",
      price: "Rp500.000",
      status: "Active",
    },
    {
      id: 6,
      title: "Scaling Digitalization with Edge-as-a-Service",
      image: "https://source.unsplash.com/400x300/?digital",
      description: "Discover how edge computing can optimize digital transformation.",
      price: "Rp350.000",
      status: "Archived", 
    },
    {
      id: 7,
      title: "Industrial IoT Training and International Advantech",
      image: "https://source.unsplash.com/400x300/?industry",
      description: "Join our industrial IoT training for a better understanding of automation.",
      price: "Rp500.000",
      status: "Active",
    },
    {
      id: 8,
      title: "Scaling Digitalization with Edge-as-a-Service",
      image: "https://source.unsplash.com/400x300/?digital",
      description: "Discover how edge computing can optimize digital transformation.",
      price: "Rp350.000",
      status: "Archived", 
    },
  ];

  const filteredData = trainingData
    .filter((item) =>
      (filterStatus === "All" || item.status === filterStatus) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "Latest"
        ? b.id - a.id
        : a.id - b.id
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
  
    // Format angka dengan pemisah ribuan titik dan koma sebagai desimal
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  
    return `Rp ${formatted.replace(',', '.')}`;  // Ganti koma dengan titik untuk desimal
  };
  

  return (
    <div className="flex flex-col justify-center w-full max-w-screen mx-auto min-h-screen px-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 mb-6 gap-4">
        <h2 className="text-2xl font-bold">Training & Courses</h2>

        <div className="flex flex-wrap gap-3 sm:ml-auto items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm pl-6 pr-10 py-2 rounded-xl border-2 border-mainOrange focus:ring-0 focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border-2 border-mainOrange focus:ring-0 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border-2 border-mainOrange focus:ring-0 focus:outline-none"
          >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
          </select>

          <Button
            variant="mainBlue"
            size="sm"
            onClick={() => router.push("/training-admin/add")}
          >
            <Plus size={16} /> Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
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
                <div className="absolute top-2 left-[-8px] bg-red-500 text-white text-xs font-bold px-10 py-1 shadow-lg z-10 rotate-[-15deg] rounded-tr-lg rounded-br-lg before:content-[''] before:absolute before:top-full before:left-0 before:w-0 before:h-0 before:border-l-[10px] before:border-l-red-700 before:border-t-[10px] before:border-t-transparent">
                  {`Discount ${Math.round(
                    ((training.price - training.discount) / training.price) * 100
                  )}%`}
                </div>
              )}
              <img
                src={training.image}
                alt={training.title}
                className="w-full h-full object-cover"
              />
            </div>

              <div className="flex flex-col justify-between flex-grow p-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                    {training.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-4">
                    {training.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t pt-3 relative">
  <div className="flex gap-2 items-center">
    <span
      className={`px-3 py-1 rounded-lg font-semibold text-sm border ${badgeClass}`}
    >
      {training.status}
    </span>

    {training.discount ? (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-500 line-through border px-3 py-1 rounded-lg">
          {formatRupiah(training.price)}
        </span>
        <span className="text-sm font-bold text-mainOrange px-3 py-1 border border-mainOrange rounded-lg ml-2">
          {formatRupiah(training.discount)}
        </span>
      </div>
    ) : (
      <span
        className={`px-3 py-1 rounded-lg font-semibold text-sm border ${badgeClass}`}
      >
        {typeof training.price === "string"
          ? training.price
          : formatRupiah(training.price)}
      </span>
    )}
  </div>

  <ArrowRight
    className="text-gray-600"
    onClick={() => router.push(`/training-admin/${training.id}`)}
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
