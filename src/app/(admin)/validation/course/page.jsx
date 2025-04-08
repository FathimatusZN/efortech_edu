"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button"

const ValidationCoursePage = () => {
  const router = useRouter();
  const [courseData, setCourseData] = useState([
    { id: "ID0000001", name: "Full Name 1", date: "12 Feb 2025", course: "PMP Certificate", session: "08.00-12.00", validation: "pending" },
    { id: "ID0000002", name: "Full Name 2", date: "Registration Date", course: "Course Name", session: "Session", validation: "pending" },
    { id: "ID0000003", name: "Full Name 3", date: "Registration Date", course: "Course Name", session: "Session", validation: "pending" },
    { id: "ID0000004", name: "Full Name 4", date: "Registration Date", course: "Course Name", session: "Session", validation: "pending" },
  ]);

  const [processedData, setProcessedData] = useState([
    { id: "ID0000001", name: "Full Name 1", date: "12 Feb 2025", course: "PMP Certificate", session: "08.00-12.00", validation: "accepted" },
    { id: "ID0000002", name: "Full Name 2", date: "Registration Date", course: "Course Name", session: "Session", validation: "accepted" },
    { id: "ID0000003", name: "Full Name 3", date: "Registration Date", course: "Course Name", session: "Session", validation: "rejected" },
    { id: "ID0000004", name: "Full Name 4", date: "12 Feb 2025", course: "PMP Certificate", session: "08.00-12.00", validation: "accepted" },
    { id: "ID0000005", name: "Full Name 5", date: "Registration Date", course: "Course Name", session: "Session", validation: "accepted" },
    { id: "ID0000006", name: "Full Name 6", date: "Registration Date", course: "Course Name", session: "Session", validation: "rejected" },
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterOpenProcessed, setIsFilterOpenProcessed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filterRef = useRef(null);
  const filterRefProcessed = useRef(null);

  const [isSearchVisibleMobile, setIsSearchVisibleMobile] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (filterRefProcessed.current && !filterRefProcessed.current.contains(event.target)) {
        setIsFilterOpenProcessed(false);
      }
    };

    if (isFilterOpen || isFilterOpenProcessed) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, isFilterOpenProcessed]);

  const checkIcon = "/assets/button_acc.png";
  const crossIcon = "/assets/button_reject.png";
  const filterIcon = "/assets/ic_filter.png";

  const handleValidation = (type, id, action) => {
    if (type === "course") {
      const updatedCourseData = courseData.map((item) =>
        item.id === id ? { ...item, validation: action } : item
      );
      setCourseData(updatedCourseData);
      if (action !== "pending") {
        const itemToMove = updatedCourseData.find((item) => item.id === id);
        setProcessedData([...processedData, { ...itemToMove, validation: action }]);
        setCourseData(updatedCourseData.filter((item) => item.id !== id));
      }
    } else {
      const updatedProcessedData = processedData.map((item) =>
        item.id === id ? { ...item, validation: action } : item
      );
      setProcessedData(updatedProcessedData);
    }
  };

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-screen mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-left mb-6">Training Registration Validation</h1>
  
      {/* Need to be Processed Section */}
      <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-4 md:p-6 mb-6 shadow-[4px_4px_0px_0px_#157ab2] md:shadow-[8px_8px_0px_0px_#157ab2] overflow-x-auto">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Need to be Processed</h2>
            <Button variant="destructive">Destructive</Button>
            <Button variant="mainBlue">mainb</Button>
            <Button variant="lightBlue">lightb</Button>
            <Button>
              <Search /> Login with Email
            </Button>
            <div className="relative" ref={filterRef}>
              {!isFilterOpen && (
                <Image
                  src={filterIcon}
                  alt="Filter"
                  width={40}
                  height={40}
                  className="cursor-pointer"
                  onClick={() => setIsFilterOpen(true)}
                />
              )}
              {isFilterOpen && (
                <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                  <p className="text-blue-600 font-bold p-2">Sort by</p>
                  <div className="border-t border-gray-300">
                    <p
                      className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Name
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Request Date
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Issued Date
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse rounded-xl overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-secondBlue text-white">
                <th className="p-3 outline outline-1 outline-white">Full Name</th>
                <th className="p-3 outline outline-1 outline-white">ID</th>
                <th className="p-3 outline outline-1 outline-white">Registration Date</th>
                <th className="p-3 outline outline-1 outline-white">Course Name</th>
                <th className="p-3 outline outline-1 outline-white">Session</th>
                <th className="p-3 outline outline-1 outline-white" colSpan={2}>Validation</th>
                <th className="p-3 outline outline-1 outline-white">Notes</th>
              </tr>
            </thead>
            <tbody>
              {courseData.length > 0 ? (
                courseData.map((item) => (
                  <tr key={item.id} className="text-center border-t">
                    <td className="p-3 border-2 border-lightBlue">{item.name}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.id}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.date}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.course}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.session}</td>
                    <td className="p-3 border-2 border-lightBlue text-center">
                      <button onClick={() => handleValidation("course", item.id, "accepted")}>
                        <Image src={checkIcon} alt="Approve" width={40} height={40} />
                      </button>
                    </td>
                    <td className="p-3 border-2 border-lightBlue text-center">
                      <button onClick={() => handleValidation("course", item.id, "rejected")}>
                        <Image src={crossIcon} alt="Reject" width={40} height={40} />
                      </button>
                    </td>
                    <td className="p-3 border-2 border-lightBlue">Notes</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-3 border-2 border-blue-200">
                    There is no registration data to validate yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Processed Section */}
      <div className="bg-white outline outline-3 outline-mainBlue shadow-[4px_4px_0px_0px_#157ab2] md:shadow-[8px_8px_0px_0px_#157ab2] rounded-2xl p-4 md:p-6 overflow-x-auto">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Processed</h2>
            <div className="flex items-center justify-end space-x-4 w-full md:justify-between">
              {/* Mobile Search Icon */}
              <div className="block md:hidden relative">
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
                      onBlur={() => setIsSearchVisibleMobile(false)} // otomatis hilang saat kehilangan fokus
                    />
                  </div>
                )}
              </div>

              {/* Desktop Search Bar */}
              <input
                type="text"
                placeholder="Search"
                className="hidden md:block border border-neutral3 rounded-lg px-3 py-1"
              />

              {/* Filter Button */}
              <div className="relative" ref={filterRefProcessed}>
                {!isFilterOpenProcessed && (
                  <Image
                    src={filterIcon}
                    alt="Filter"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                    onClick={() => setIsFilterOpenProcessed(true)}
                  />
                )}
                {isFilterOpenProcessed && (
                  <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-48">
                    <p className="text-mainBlue font-bold p-2">Filter by</p>
                    <div className="border-t border-gray-300">
                      <p
                        className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                        onClick={() => setIsFilterOpenProcessed(false)}
                      >
                        Accepted Status
                      </p>
                      <p
                        className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                        onClick={() => setIsFilterOpenProcessed(false)}
                      >
                        Rejected Status
                      </p>
                      <p
                        className="cursor-pointer hover:bg-gray-200 text-mainBlue p-2"
                        onClick={() => setIsFilterOpenProcessed(false)}
                      >
                        Finished Course
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse rounded-xl overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-secondBlue text-white">
                <th className="p-3 outline outline-1 outline-white">Full Name</th>
                <th className="p-3 outline outline-1 outline-white">ID</th>
                <th className="p-3 outline outline-1 outline-white">Registration Date</th>
                <th className="p-3 outline outline-1 outline-white">Course Name</th>
                <th className="p-3 outline outline-1 outline-white">Session</th>
                <th className="p-3 outline outline-1 outline-white">Validation</th>
                <th className="p-3 outline outline-1 outline-white">Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="text-center border-t">
                    <td className="p-3 border-2 border-lightBlue">{item.name}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.id}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.date}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.course}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.session}</td>
                    <td className="p-3 border-2 border-lightBlue">{item.validation}</td>
                    <td className="p-3 border-2 border-lightBlue">Notes</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-3 border-2 border-blue-200">
                    No processed data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-full bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-gray-600">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );  
};

export default ValidationCoursePage;