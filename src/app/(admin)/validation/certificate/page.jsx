"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ValidationCertificatePage = () => {
  const router = useRouter();
  const [courseData, setCourseData] = useState([
    { id: "ID0000001", name: "Full Name 1", date: "12 Feb 2025", course: "PMP Certificate", expired: "12 Feb 2027", validation: "pending", notes: "Notes" },
    { id: "ID0000002", name: "Full Name 2", date: "12 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "pending", notes: "Notes" },
    { id: "ID0000003", name: "Full Name 3", date: "12 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "pending", notes: "Notes" },
    { id: "ID0000004", name: "Full Name 4", date: "12 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "pending", notes: "Notes" },
]);

const [processedData, setProcessedData] = useState([
    { id: "ID0000001", name: "Full Name 1", date: "12 Feb 2025", course: "PMP Certificate", expired: "12 Feb 2027", validation: "accepted", notes: "Notes" },
    { id: "ID0000002", name: "Full Name 2", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "accepted", notes: "Notes" },
    { id: "ID0000003", name: "Full Name 3", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "rejected", notes: "Notes" },
    { id: "ID0000004", name: "Full Name 1", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "accepted", notes: "Notes" },
    { id: "ID0000005", name: "Full Name 2", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "accepted", notes: "Session Schedule is Full" },
    { id: "ID0000006", name: "Full Name 3", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "rejected", notes: "Notes" },
    { id: "ID0000007", name: "Full Name 1", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "accepted", notes: "Notes" },
    { id: "ID0000008", name: "Full Name 2", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "rejected", notes: "Session Schedule is Full" },
    { id: "ID0000009", name: "Full Name 3", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "accepted", notes: "Notes" },
    { id: "ID0000010", name: "Full Name 3", date: "10 Feb 2025", course: "Training Name", expired: "12 Feb 2027", validation: "accepted", notes: "Notes" },
]);


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterOpenProcessed, setIsFilterOpenProcessed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filterRef = useRef(null);
  const filterRefProcessed = useRef(null);

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
    <div className="max-w-screen mx-auto p-6">
      <h1 className="text-2xl font-bold text-left mb-6">Training Certificate Validation</h1>

      {/* Need to be Processed Section */}
      <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-6 mb-6 shadow-[8px_8px_0px_0px_#157ab2]">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Need to be Processed</h2>
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
        <table className="w-full border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-secondBlue text-white">
              <th className="p-3 outline outline-1 outline-white">Full Name</th>
              <th className="p-3 outline outline-1 outline-white">ID</th>
              <th className="p-3 outline outline-1 outline-white">Issued Date</th>
              <th className="p-3 outline outline-1 outline-white">Training Name</th>
              <th className="p-3 outline outline-1 outline-white">Expired Date</th>
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
                  <td className="p-3 border-2 border-lightBlue">{item.expired}</td>
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

      {/* Processed Section */}
      <div className="bg-white outline outline-3 outline-mainBlue shadow-[8px_8px_0px_0px_#157ab2] rounded-2xl p-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Processed</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search"
                className="border border-neutral3 rounded-lg px-3 py-1"
              />
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
        <table className="w-full border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-mainBlue text-white">
              <th className="p-3 outline outline-1 outline-white">Full Name</th>
              <th className="p-3 outline outline-1 outline-white">ID</th>
              <th className="p-3 outline outline-1 outline-white">Issued Date</th>
              <th className="p-3 outline outline-1 outline-white">Training Name</th>
              <th className="p-3 outline outline-1 outline-white">Expired Date</th>
              <th className="p-3 outline outline-1 outline-white" colSpan={2}>Validation</th>
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
                  <td className="p-3 border-2 border-lightBlue">{item.expired}</td>
                  <td className="p-3 border-2 border-lightBlue text-center">
                    <button
                      onClick={() => handleValidation("processed", item.id, "accepted")}
                      disabled={item.validation === "accepted"}
                    >
                      <Image
                        src={checkIcon}
                        alt="Approve"
                        width={40}
                        height={40}
                        className={item.validation === "accepted" ? "opacity-50" : ""}
                      />
                    </button>
                  </td>
                  <td className="p-3 border-2 border-lightBlue text-center">
                    <button
                      onClick={() => handleValidation("processed", item.id, "rejected")}
                      disabled={item.validation === "rejected"}
                    >
                      <Image
                        src={crossIcon}
                        alt="Reject"
                        width={40}
                        height={40}
                        className={item.validation === "rejected" ? "opacity-50" : ""}
                      />
                    </button>
                  </td>
                  <td className="p-3 border-2 border-lightBlue">
                    {item.validation === "rejected" ? "Session Schedule is Full" : "Notes"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-3 border-2 border-lightBlue">
                  There is no processed data to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      </div>
    </div>
  );
};

export default ValidationCertificatePage;