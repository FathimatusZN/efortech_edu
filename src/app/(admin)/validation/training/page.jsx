"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ValidationTrainingTable } from "@/components/admin/ValidationTrainingTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { AdditionalParticipantDialog } from "@/components/admin/AdditionalParticipantDialog";

const ValidationCoursePage = () => {
  // States for UI and logic control
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterOpenProcessed, setIsFilterOpenProcessed] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [isSearchVisibleMobile, setIsSearchVisibleMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [processedFilter, setProcessedFilter] = useState(null);

  const [courseData, setCourseData] = useState({
    needToBeProcessed: [],
    processedData: [],
  });

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filterRef = useRef(null);
  const filterRefProcessed = useRef(null);

  // Show additional participants dialog
  const onShowParticipants = (participants) => {
    setSelectedParticipants(participants);
    setIsDialogOpen(true);
  };

  // Handle updating status and moving item between process groups
  const handleStatusChange = (registrationId, newStatus) => {
    setCourseData((prev) => {
      const updatedNeedToProcess = prev.needToBeProcessed.filter(
        (item) => item.registration_id !== registrationId
      );
      const updatedProcessed = [...prev.processedData];

      const targetItemFromNeed = prev.needToBeProcessed.find(
        (item) => item.registration_id === registrationId
      );
      const targetItemFromProcessed = prev.processedData.find(
        (item) => item.registration_id === registrationId
      );

      const updatedItem = {
        ...(targetItemFromNeed || targetItemFromProcessed),
        status: newStatus,
      };

      if (newStatus === 4) {
        return {
          needToBeProcessed: updatedNeedToProcess,
          processedData: [...updatedProcessed, updatedItem],
        };
      } else {
        return {
          needToBeProcessed: prev.needToBeProcessed.map((item) =>
            item.registration_id === registrationId ? updatedItem : item
          ),
          processedData: prev.processedData.map((item) =>
            item.registration_id === registrationId ? updatedItem : item
          ),
        };
      }
    });
  };

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();

        const rawData = result.data || [];
        console.log("Raw API Data:", rawData);

        setCourseData({
          needToBeProcessed: rawData.filter((item) =>
            [1, 2, 3].includes(item.status)
          ),
          processedData: rawData.filter((item) => item.status === 4),
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, []);

  // Close filter dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRefProcessed.current &&
        !filterRefProcessed.current.contains(event.target)
      ) {
        setIsFilterOpenProcessed(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and search processed data
  const filteredAndSearchedData = courseData.processedData
    .filter((item) => {
      if (!processedFilter) return true;
      return (
        item.validation?.toLowerCase?.() === processedFilter.toLowerCase?.()
      );
    })
    .filter((item) =>
      item.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const processedData = courseData.processedData;
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="max-w-screen mx-auto p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-left mb-6">
          Training Registration Validation
        </h1>

        {/* Section for unprocessed registration data */}
        <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 md:p-6 mb-6 shadow-[4px_4px_0px_0px_#157ab2] md:shadow-[8px_8px_0px_0px_#157ab2] overflow-x-auto">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Need to be Processed</h2>
              <div className="relative" ref={filterRef}>
                {!isFilterOpen && (
                  <BsFillFilterSquareFill
                    className="w-10 h-10 text-secondOrange cursor-pointer"
                    onClick={() => setIsFilterOpen(true)}
                  />
                )}
                {isFilterOpen && (
                  <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                    <p className="text-blue-600 font-bold p-2">Sort by</p>
                    <div className="border-t border-gray-300">
                      <p
                        className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                        onClick={() => {
                          setCourseData((prev) => ({
                            ...prev,
                            needToBeProcessed: [...prev.needToBeProcessed].sort(
                              (a, b) => a.fullName.localeCompare(b.fullName)
                            ),
                          }));
                          setIsFilterOpen(false);
                        }}
                      >
                        Name
                      </p>
                      <p
                        className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                        onClick={() => {
                          setCourseData((prev) => ({
                            ...prev,
                            needToBeProcessed: [...prev.needToBeProcessed].sort(
                              (a, b) =>
                                new Date(a.requestDate) -
                                new Date(b.requestDate)
                            ),
                          }));
                          setIsFilterOpen(false);
                        }}
                      >
                        Registration Date
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <AdditionalParticipantDialog
            open={isDialogOpen}
            participants={selectedParticipants}
            onClose={() => setIsDialogOpen(false)}
          />
          <ValidationTrainingTable
            data={courseData.needToBeProcessed}
            mode="needToProcess"
            onShowParticipants={onShowParticipants}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Section for processed registration data */}
        <div className="bg-white outline outline-3 outline-mainBlue shadow-[4px_4px_0px_0px_#157ab2] md:shadow-[8px_8px_0px_0px_#157ab2] rounded-2xl p-4 md:p-6 overflow-x-auto">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Processed</h2>
              <div className="flex items-center space-x-4">
                {/* Desktop Search */}
                <input
                  type="text"
                  placeholder="Search"
                  className="hidden md:flex justify-end border border-mainOrange rounded-lg px-3 py-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Mobile Search */}
                <div className="relative md:hidden">
                  {!isSearchVisibleMobile ? (
                    <button onClick={() => setIsSearchVisibleMobile(true)}>
                      <Search className="w-6 h-6 text-mainBlue" />
                    </button>
                  ) : (
                    <div className="absolute right-0 z-50">
                      <input
                        type="text"
                        placeholder="Search"
                        className="border border-neutral3 rounded-lg px-3 py-1 w-48"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setIsSearchVisibleMobile(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Filter Dropdown */}
                <div className="relative" ref={filterRefProcessed}>
                  {!isFilterOpenProcessed && (
                    <BsFillFilterSquareFill
                      className="w-10 h-10 text-secondOrange cursor-pointer"
                      onClick={() => setIsFilterOpenProcessed(true)}
                    />
                  )}
                  {isFilterOpenProcessed && (
                    <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                      <p className="text-blue-600 font-bold p-2">Filter by</p>
                      <div className="border-t border-gray-300">
                        {[
                          "accepted",
                          "rejected",
                          "finished",
                        ].map((status) => (
                          <p
                            key={status}
                            className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                            onClick={() => {
                              setProcessedFilter(status);
                              setIsFilterOpenProcessed(false);
                            }}
                          >
                            {status.charAt(0).toUpperCase() +
                              status.slice(1)} Status
                          </p>
                        ))}
                      </div>
                      <p
                        className="cursor-pointer text-red-600 hover:bg-gray-100 p-2"
                        onClick={() => {
                          setProcessedFilter(null);
                          setIsFilterOpenProcessed(false);
                        }}
                      >
                        Clear Filter
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ValidationTrainingTable
            data={paginatedData}
            mode="processed"
            onStatusChange={handleStatusChange}
          />

          <Pagination className="flex mt-3 justify-end">
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
      </div>
    </ProtectedRoute>
  );
};

export default ValidationCoursePage;