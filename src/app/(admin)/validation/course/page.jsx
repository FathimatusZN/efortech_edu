"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ValidationTable } from "@/components/ui/ValidationTable";
import { dummyCourseData } from "@/app/(admin)/validation/Data";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { BsFillFilterSquareFill } from "react-icons/bs";

const ValidationCoursePage = () => {
  const router = useRouter();
  const [courseData, setCourseData] = useState(dummyCourseData);

  const needToBeProcessed = courseData.filter(item => !item.validation);
  const processedData = courseData.filter(item => item.validation);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterOpenProcessed, setIsFilterOpenProcessed] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filterRef = useRef(null);
  const filterRefProcessed = useRef(null);
  const [isSearchVisibleMobile, setIsSearchVisibleMobile] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [processedFilter, setProcessedFilter] = useState(null);

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

  const handleValidation = (type, id, action) => {
    const updatedCourseData = courseData.map((item) =>
      item.id === id ? { ...item, validation: action } : item
    );
    setCourseData(updatedCourseData);
  };

  const filteredAndSearchedData = processedData
  .filter((item) => {
    if (!processedFilter) return true;
    return item.validation?.toLowerCase() === processedFilter.toLowerCase();
  })
  .filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const totalPages = Math.ceil(filteredAndSearchedData.length / itemsPerPage);
  const paginatedData = filteredAndSearchedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="max-w-screen mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-left mb-6">Training Registration Validation</h1>

      {/* Need to be Processed Section */}
      <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 md:p-6 mb-6 shadow-[4px_4px_0px_0px_#157ab2] md:shadow-[8px_8px_0px_0px_#157ab2] overflow-x-auto">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Need to be Processed</h2>
            <div className="relative" ref={filterRef}>
              {!isFilterOpen && (
                <BsFillFilterSquareFill className="w-10 h-10 text-secondOrange cursor-pointer" onClick={() => setIsFilterOpen(true)} />
              )}
              {isFilterOpen && (
                <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                  <p className="text-blue-600 font-bold p-2">Sort by</p>
                  <div className="border-t border-gray-300">
                    <p
                      className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                      onClick={() => {
                        setCourseData([...needToBeProcessed].sort((a, b) => a.fullName.localeCompare(b.fullName)));
                        setIsFilterOpen(false);
                    }}
                    >
                      Name
                    </p>

                    <p
                      className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                      onClick={() => {
                        setCourseData([...needToBeProcessed].sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate)));
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
          <ValidationTable
            data={needToBeProcessed}
            dataType="course"
            statusType="needToProcess"
            onAccept={(id) => handleValidation("accept", id, "accepted")}
            onReject={(id) => handleValidation("reject", id, "rejected")}
          />
      </div>

      {/* Processed Section */}
      <div className="bg-white outline outline-3 outline-mainBlue shadow-[4px_4px_0px_0px_#157ab2] md:shadow-[8px_8px_0px_0px_#157ab2] rounded-2xl p-4 md:p-6 overflow-x-auto">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Processed</h2>
            <div className="flex items-center space-x-4">
              {/* Search Desktop */}
              <input
                type="text"
                placeholder="Search"
                className="hidden md:flex justify-end border border-mainOrange rounded-lg px-3 py-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Search Mobile */}
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

              {/* Filter */}
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
                        <p onClick={() => { setProcessedFilter("accepted"); setIsFilterOpenProcessed(false); }} className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2">Accepted Status</p>
                        <p onClick={() => { setProcessedFilter("rejected"); setIsFilterOpenProcessed(false); }} className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2">Rejected Status</p>
                        <p onClick={() => { setProcessedFilter("finished"); setIsFilterOpenProcessed(false); }} className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2">Finished Course</p>
                      </div>
                      <p className="cursor-pointer text-red-600 hover:bg-gray-100 p-2" onClick={() => { setProcessedFilter(null); setIsFilterOpenProcessed(false); }}>
                        Clear Filter
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <ValidationTable data={paginatedData} dataType="course" statusType="processed" />

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
  );
};

export default ValidationCoursePage;
