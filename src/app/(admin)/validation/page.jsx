"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter} from "next/navigation";

const ValidationPage = () => {
    const router = useRouter();
    const [courseData, setCourseData] = useState([
        { id: "ID0000001", name: "Full Name 1", date: "12 Feb 2025", course: "PMP Certificate", session: "08.00-12.00" },
        { id: "ID0000002", name: "Full Name 2", date: "Registration Date", course: "Course Name", session: "Session" },
        { id: "ID0000003", name: "Full Name 3", date: "Registration Date", course: "Course Name", session: "Session" },
        { id: "ID0000004", name: "Full Name 4", date: "Registration Date", course: "Course Name", session: "Session" },
    ]);

    const [certificateData, setCertificateData] = useState([
        { id: "ID0000001", name: "Full Name 1", issued: "20 Nov 2024", course: "PMP Certificate", expired: "20 Nov 2026" },
        { id: "ID0000002", name: "Full Name 2", issued: "Registration Date", course: "Course Name", expired: "Session" },
        { id: "ID0000003", name: "Full Name 3", issued: "Registration Date", course: "Course Name", expired: "Session" },
        { id: "ID0000004", name: "Full Name 4", issued: "Registration Date", course: "Course Name", expired: "Session" },
    ]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
      
        useEffect(() => {
          const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
              setIsFilterOpen(false);
            }
          };
      
          if (isFilterOpen) {
            document.addEventListener("mousedown", handleClickOutside);
          } else {
            document.removeEventListener("mousedown", handleClickOutside);
          }
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [isFilterOpen]);

    const checkIcon = "/assets/button_acc.png";
    const crossIcon = "/assets/button_reject.png";
    const filterIcon = "/assets/ic_filter.png";

    const handleValidation = (type, id) => {
        if (type === "course") {
            setCourseData(courseData.filter((item) => item.id !== id));
        } else {
            setCertificateData(certificateData.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="max-w-screen mx-auto p-6">
            <h1 className="text-2xl font-bold text-left mb-6">Validation</h1>
            
            {/* Course Registration Validation */}
            <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl p-6 mb-6 shadow-[8px_8px_0px_0px_#157ab2]">
            <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Course Registration Validation</h2>
                <div className="relative" ref={filterRef}>
                {!isFilterOpen && (
                    <Image
                    src={filterIcon}
                    alt="Filter"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                    onClick={() => setIsFilterOpen(true)}
                    />
                )}
                {isFilterOpen && (
                    <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                    <p className="text-secondBlue font-bold p-2">Sort by</p>
                    <div className="border-t border-gray-300">
                        <p
                        className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2"
                        onClick={() => setIsFilterOpen(false)}
                        >
                        Name
                        </p>
                        <p
                        className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2"
                        onClick={() => setIsFilterOpen(false)}
                        >
                        Request Date
                        </p>
                        <p
                        className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2"
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
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-mainBlue text-white">
                            <th className="p-3 border-2 border-black">Full Name</th>
                            <th className="p-3 border-2 border-black">ID</th>
                            <th className="p-3 border-2 border-black">Registration Date</th>
                            <th className="p-3 border-2 border-black">Course Name</th>
                            <th className="p-3 border-2 border-black">Session</th>
                            <th className="p-3 border-2 border-black" colSpan={2}>Validation</th>
                            <th className="p-3 border-2 border-black">Notes</th>
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
                                        <button onClick={() => handleValidation("course", item.id)}>
                                            <Image src={checkIcon} alt="Approve" width={40} height={40} />
                                        </button>
                                    </td>
                                    <td className="p-3 border-2 border-lightBlue text-center">
                                        <button onClick={() => handleValidation("course", item.id)}>
                                            <Image src={crossIcon} alt="Reject" width={40} height={40} />
                                        </button>
                                    </td>
                                    <td className="p-3 border-2 border-lightBlue">Notes</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center p-3 border-2 border-lightBlue">There is no registration data to validate yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-end mt-4">
                    <a href="/validation/course" className="text-black underline cursor-pointer">See All Validation</a>
                </div>
            </div>

            {/* Certificate Validation */}
            <div className="bg-white outline outline-3 outline-mainBlue shadow-[8px_8px_0px_0px_#157ab2] rounded-2xl p-6">
            <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Course Registration Validation</h2>
                <div className="relative" ref={filterRef}>
                {!isFilterOpen && (
                    <Image
                    src={filterIcon}
                    alt="Filter"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                    onClick={() => setIsFilterOpen(true)}
                    />
                )}
                {isFilterOpen && (
                    <div className="absolute top-full z-50 mt-2 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-40">
                    <p className="text-secondBlue font-bold p-2">Sort by</p>
                    <div className="border-t border-gray-300">
                        <p
                        className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2"
                        onClick={() => setIsFilterOpen(false)}
                        >
                        Name
                        </p>
                        <p
                        className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2"
                        onClick={() => setIsFilterOpen(false)}
                        >
                        Request Date
                        </p>
                        <p
                        className="cursor-pointer hover:bg-gray-200 text-secondBlue p-2"
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
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-mainBlue text-white">
                            <th className="p-3 border-2 border-black">Full Name</th>
                            <th className="p-3 border-2 border-black">ID</th>
                            <th className="p-3 border-2 border-black">Issued Date</th>
                            <th className="p-3 border-2 border-black">Course Name</th>
                            <th className="p-3 border-2 border-black">Expired Date</th>
                            <th className="p-3 border-2 border-black" colSpan={2}>Validation</th>
                            <th className="p-3 border-2 border-black">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificateData.length > 0 ? (
                            certificateData.map((item) => (
                            <tr key={item.id} className="text-center border-t">
                                <td className="p-3 border-2 border-lightBlue">{item.name}</td>
                                <td className="p-3 border-2 border-lightBlue">{item.id}</td>
                                <td className="p-3 border-2 border-lightBlue">{item.issued}</td>
                                <td className="p-3 border-2 border-lightBlue">{item.course}</td>
                                <td className="p-3 border-2 border-lightBlue">{item.expired}</td>
                                <td className="p-3 border-2 border-lightBlue">
                                    <button onClick={() => handleValidation("course", item.id)}>
                                        <Image src={checkIcon} alt="Approve" width={40} height={40} />
                                    </button>
                                </td>
                                <td className="p-3 border-2 border-lightBlue">
                                    <button onClick={() => handleValidation("course", item.id)}>
                                        <Image src={crossIcon} alt="Reject" width={40} height={40} />
                                    </button>
                                </td>
                                <td className="py-3 border-2 border-lightBlue">notes</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center p-3 border-2 border-lightBlue">There is no certificate data to validate yet.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className="flex justify-end mt-4">
                    <a href="/all-validations" className="text-black underline cursor-pointer">See All Validation</a>
                </div>
            </div>
        </div>
    );
};

export default ValidationPage;