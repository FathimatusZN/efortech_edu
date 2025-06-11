//efortech_edu\src\app\(admin)\validation\training\page.jsx

"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidationTrainingTable } from "@/components/admin/ValidationTrainingTable";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AdditionalParticipantDialog } from "@/components/admin/AdditionalParticipantDialog";
import { UploadCertificateDialog } from "@/components/admin/UploadCertificateDialog";
import { FaSearch } from "react-icons/fa";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { FaFilter } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ValidationTrainingClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get("tab") || "needprocess";
    const [tab, setTab] = useState(initialTab);

    const handleTabChange = (newTab) => {
        setTab(newTab);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", newTab);
        router.push(`/validation/training?${params.toString()}`);
    };

    const [trainingData, setTrainingData] = useState({
        needProcessData: null,
        onProgressData: null,
        completedData: null,
        cancelledData: null,
    });
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const [attendanceStatus, setAttendanceStatus] = useState({});

    const STATUS_LABELS = {
        "1": "Pending",
        "2": "Waiting for Payment",
        "3": "Validated",
        "4": "Completed",
        "5": "Cancelled",
    };

    const ATTENDANCE_LABELS = {
        "true": "Present",
        "false": "Absent",
        "null": "Not Marked",
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortOpen, setSortOpen] = useState(false);
    const [tempSortField, setTempSortField] = useState(sortBy);
    const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
    const [searchInput, setSearchInput] = useState("");

    const [selectedFilters, setSelectedFilters] = useState({
        needprocess: { status: ["1", "2", "3"] },
        onprogress: { attendance_status: ["null", "true", "false"] },
        completed: { attendance_status: ["true", "false"] },
        cancelled: { status: ["5"] },
    });

    // Tab configuration for fetching data
    const tabConfig = {
        needprocess: {
            url: "/api/registration/search",
            key: "needProcessData",
            searchFields: ["registration_id", "registration_date", "registrant_name", "training_name"],
            filters: {
                status: ["1", "2", "3", "4", "5"],
            },
            sortFields: ["registration_id", "registrant_name", "registration_date", "training_date", "training_name", "participant_count"],
        },
        onprogress: {
            url: "/api/enrollment/participants?mode=onprogress",
            key: "onProgressData",
            searchFields: ["registration_participant_id", "fullname", "training_name"],
            filters: {
                attendance_status: ["null", "true", "false"],
            },
            sortFields: ["registration_participant_id", "fullname", "registration_date", "training_date", "training_name"],
        },
        completed: {
            url: "/api/enrollment/participants?mode=completed",
            key: "completedData",
            searchFields: ["registration_participant_id", "fullname", "training_name"],
            filters: {
                attendance_status: ["true", "false"],
            },
            sortFields: ["registration_participant_id", "fullname", "registration_date", "training_date", "training_name"],
        },
        cancelled: {
            url: "/api/registration/search?status=5",
            key: "cancelledData",
            searchFields: ["registration_id", "registration_date", "registrant_name", "training_name"],
            filters: {
                status: ["5"],
            },
            sortFields: ["registration_id", "registrant_name", "registration_date", "training_date", "training_name", "participant_count"],
        },
    };

    const buildQueryParams = () => {
        const config = tabConfig[tab];
        const params = new URLSearchParams();

        const urlObj = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}${config.url}`, "http://localhost");
        const baseURL = urlObj.pathname;

        urlObj.searchParams.forEach((value, key) => {
            params.append(key, value);
        });

        if (searchQuery) params.append("keyword", searchQuery);

        const rawStatus = selectedFilters[tab].status || [];
        const uniqueStatus = [...new Set(rawStatus)];
        uniqueStatus.forEach((statusCode) => {
            if (statusCode) params.append("status", statusCode);
        });

        if (sortBy) params.append("sort_by", sortBy);
        if (sortOrder) params.append("sort_order", sortOrder);

        Object.entries(selectedFilters[tab]).forEach(([key, value]) => {
            if (key !== "status") {
                if (Array.isArray(value)) {
                    [...new Set(value)].forEach((val) => params.append(key, val));
                } else if (value) {
                    params.append(key, value);
                }
            }
        });

        return `${baseURL}?${params.toString()}`;
    };

    // Fetch training data 
    const fetchTabData = async (tabKey = tab) => {
        const config = tabConfig[tabKey];
        if (!config) return;

        setLoading(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${buildQueryParams()}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error();

            const result = await response.json();
            const data = result?.data || [];

            setTrainingData((prev) => ({
                ...prev,
                [config.key]: data,
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch data for tab: " + tabKey);
        } finally {
            setLoading(false);
        }
    };

    const currentConfig = tabConfig[tab];

    // Automatically fetch data for the selected tab when the component mounts
    useEffect(() => {
        fetchTabData(tab);
    }, [tab]);

    // Fetch data for the selected tab when the component mounts or when the tab changes
    useEffect(() => {
        if (!trainingData[`${tabConfig[tab]?.key}`]) {
            fetchTabData(tab);
        }
    }, [tab]);

    useEffect(() => {
        fetchTabData();
    }, [searchQuery, JSON.stringify(selectedFilters[tab]), sortBy, sortOrder, tab]);

    useEffect(() => {
        setSearchInput("");
        setSearchQuery("");

        const config = tabConfig[tab];
        if (!config) return;

        let defaultFilter = { ...config.filters };
        let defaultSortBy = "";
        let defaultSortOrder = "DESC";

        if (tab === "needprocess" || tab === "cancelled") {
            defaultSortBy = "registration_date";
        } else if (tab === "onprogress" || tab === "completed") {
            defaultSortBy = "completed_date";
        }

        setSortBy(defaultSortBy);
        setSortOrder(defaultSortOrder);

        if (tab === "needprocess") {
            defaultFilter.status = ["1", "2", "3"];
        } else if (tab === "onprogress") {
            defaultFilter.attendance_status = ["null", "true", "false"];
        } else if (tab === "completed") {
            defaultFilter.attendance_status = ["true", "false"];
        } else if (tab === "cancelled") {
            defaultFilter.status = ["5"];
        }

        // ensure status key always exists (even empty)
        if (!defaultFilter.status) {
            defaultFilter.status = [];
        }

        setSelectedFilters((prev) => ({
            ...prev,
            [tab]: defaultFilter,
        }));
    }, [tab]);

    // Function to handle showing participants in a dialog
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    const onShowDetailRegistration = (registration) => {
        setSelectedRegistration(registration);
        setIsDetailDialogOpen(true);
    };

    // Function to handle showing upload certificate dialog
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const onShowUploadDialog = (participant) => {
        setSelectedParticipant(participant);
        setIsUploadDialogOpen(true);
    }

    // Function to handle status change for training registrations
    const handleStatusChange = async (registrationId, newStatus) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/update/${registrationId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!res.ok) throw new Error("Failed to update status");

            toast.success("Status updated successfully");
            fetchTabData(tab); // Re-fetch data after status change
        } catch (err) {
            console.error(err);
            toast.error("Error updating status");
        }
    };

    // Function to handle attendance status change
    const handleAttendanceChange = async (id, status) => {
        try {
            // Update attendance status in the database
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/attendance/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ attendance_status: status }),
                }
            );

            if (!res.ok) throw new Error("Failed to update attendance");

            // renew attendance status in component state
            setAttendanceStatus((prev) => ({
                ...prev,
                [id]: status,
            }));

            toast.success("Attendance updated");
            fetchTabData(tab);
        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error("Error updating attendance");
        }
    };

    // Function to handle click outside the filter dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterRef.current && !filterRef.current.contains(event.target)
            ) {
                setIsFilterOpen(false);
            }

            if (
                sortRef.current && !sortRef.current.contains(event.target)
            ) {
                setSortOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="max-w-screen mx-auto p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-left">
                    Training Registration Validation
                </h1>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                    <div className="bg-white overflow-hidden">
                        {/* Tabs Header and Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                            {/* Tabs */}
                            <TabsList className="flex flex-wrap gap-2">
                                <TabsTrigger value="needprocess">Need to Process</TabsTrigger>
                                <TabsTrigger value="onprogress">On Progress</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                            </TabsList>

                            {/* Search, Filter and Sort */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                                {/* Search Input */}
                                <div className="relative w-full sm:w-[250px]">
                                    <input
                                        type="text"
                                        placeholder={`Type search keyword...`}
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setSearchQuery(searchInput);
                                            } // trigger search
                                        }}
                                        className="text-sm w-full pl-6 pr-10 py-2 rounded-md border border-mainBlue focus:ring-0 focus:outline-none"
                                    />
                                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>

                                {/* Filter Button (Checkbox List Dropdown) */}
                                <div className="relative" ref={filterRef}>
                                    <button
                                        className="w-full sm:w-[180px] border border-mainBlue rounded-md text-sm px-4 py-2 text-left"
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    >
                                        Filter by
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute z-10 mt-2 w-[180px] bg-white border border-gray-300 rounded-md shadow-md p-2 space-y-2 text-sm">
                                            {/* Status Filter */}
                                            {currentConfig.filters?.status?.map((statusCode) => (
                                                <div key={statusCode} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`status-${statusCode}`}
                                                        checked={selectedFilters[tab].status?.includes(statusCode) || false}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedFilters((prev) => {
                                                                const prevTabFilters = prev[tab] || {};
                                                                const prevStatus = prevTabFilters.status || [];

                                                                return {
                                                                    ...prev,
                                                                    [tab]: {
                                                                        ...prevTabFilters,
                                                                        status: checked
                                                                            ? [...prevStatus, statusCode]
                                                                            : prevStatus.filter((s) => s !== statusCode),
                                                                    },
                                                                };
                                                            });

                                                        }}
                                                    />
                                                    <label htmlFor={`status-${statusCode}`}>
                                                        {STATUS_LABELS[statusCode] || `${statusCode}`}
                                                    </label>
                                                </div>
                                            ))}

                                            {/* Attendance Status Filter */}
                                            {currentConfig.filters?.attendance_status?.map((attendanceStatus) => (
                                                <div key={attendanceStatus} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`attendance-status-${attendanceStatus}`}
                                                        checked={selectedFilters[tab].attendance_status?.includes(attendanceStatus) || false}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedFilters((prev) => {
                                                                const prevAttendanceFilter = prev[tab] || {};
                                                                const prevAttendance = prevAttendanceFilter.attendance_status || [];

                                                                return {
                                                                    ...prev,
                                                                    [tab]: {
                                                                        ...prevAttendanceFilter,
                                                                        attendance_status: checked
                                                                            ? [...prevAttendance, attendanceStatus]
                                                                            : prevAttendance.filter((s) => s !== attendanceStatus),
                                                                    },
                                                                };
                                                            });
                                                        }}
                                                    />
                                                    <label htmlFor={`attendance-status-${attendanceStatus}`}>
                                                        {ATTENDANCE_LABELS[attendanceStatus] || `${attendanceStatus}`}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative" ref={sortRef}>
                                    <button
                                        onClick={() => setSortOpen(!sortOpen)}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm flex items-center gap-2"
                                    >
                                        <FaFilter className="text-base" />
                                        Sort
                                    </button>

                                    {sortOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                                            <p className="text-sm font-medium mb-2">Sort Order</p>
                                            <div className="flex gap-4 mb-4">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        value="ASC"
                                                        checked={tempSortOrder === "ASC"}
                                                        onChange={() => setTempSortOrder("ASC")}
                                                    />
                                                    Ascending
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        value="DESC"
                                                        checked={tempSortOrder === "DESC"}
                                                        onChange={() => setTempSortOrder("DESC")}
                                                    />
                                                    Descending
                                                </label>
                                            </div>

                                            <p className="text-sm font-medium mb-2">Sort By</p>
                                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                                {currentConfig.sortFields.map((field) => (
                                                    <button
                                                        key={field}
                                                        onClick={() => setTempSortField(field)}
                                                        className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm ${tempSortField === field ? "bg-blue-100 font-semibold" : ""
                                                            }`}
                                                    >
                                                        {field
                                                            .replaceAll("_", " ")
                                                            .split(" ")
                                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(" ")}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex justify-end mt-4 gap-2">
                                                <button
                                                    className="text-sm text-gray-500 hover:underline"
                                                    onClick={() => setSortOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSortBy(tempSortField);
                                                        setSortOrder(tempSortOrder);
                                                        setSortOpen(false);
                                                        fetchTabData(); // apply sorting
                                                    }}
                                                    className="text-sm bg-mainBlue text-white px-3 py-1 rounded"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className="border-t border-gray-200 mt-2" />

                        <div className="p-1 mt-2 mr-1">
                            <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl px-4 py-2 mb-4 shadow-[8px_8px_0px_0px_#157ab2] overflow-x-auto">
                                <div className="flex items-center justify-between">
                                    {/* Need to be process tab */}
                                    <TabsContent value="needprocess" className="w-full">
                                        <AdditionalParticipantDialog
                                            open={selectedRegistration !== null}
                                            onClose={() => setSelectedRegistration(null)}
                                            registration={selectedRegistration}
                                        />
                                        {trainingData.needProcessData ? (
                                            <ValidationTrainingTable
                                                data={trainingData.needProcessData}
                                                mode="needprocess"
                                                onShowDetailRegistration={onShowDetailRegistration}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ) : (
                                            <div className="w-full flex justify-center items-center min-h-[120px]">
                                                <LoadingSpinner className="w-10 h-10" />
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* On Progress tab */}
                                    <TabsContent value="onprogress" className="w-full">
                                        <UploadCertificateDialog
                                            open={isUploadDialogOpen}
                                            setOpen={setIsUploadDialogOpen}
                                            participant={selectedParticipant}
                                            onShowSuccess={() => {
                                                toast.success("Certificate saved successfully!");
                                                fetchTabData(tab);
                                            }}
                                        />
                                        {trainingData.onProgressData ? (
                                            <ValidationTrainingTable
                                                data={trainingData.onProgressData}
                                                mode="onprogress"
                                                onAttendanceChange={handleAttendanceChange}
                                                onShowUploadDialog={onShowUploadDialog}
                                                onUploadClick={onShowUploadDialog}
                                            />
                                        ) : (
                                            <div className="w-full flex justify-center items-center min-h-[120px]">
                                                <LoadingSpinner className="w-10 h-10" />
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Completed tab */}
                                    <TabsContent value="completed" className="w-full">
                                        <UploadCertificateDialog
                                            open={isUploadDialogOpen}
                                            setOpen={setIsUploadDialogOpen}
                                            participant={selectedParticipant}
                                            onShowSuccess={() => {
                                                toast.success("Certificate saved successfully!");
                                                fetchTabData(tab);
                                            }}
                                        />
                                        {trainingData.completedData ? (
                                            <ValidationTrainingTable
                                                data={trainingData.completedData}
                                                mode="completed"
                                                onAttendanceChange={handleAttendanceChange}
                                                onShowUploadDialog={onShowUploadDialog}
                                                onUploadClick={onShowUploadDialog}
                                            />
                                        ) : (
                                            <div className="w-full flex justify-center items-center min-h-[120px]">
                                                <LoadingSpinner className="w-10 h-10" />
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Cancelled tab */}
                                    <TabsContent value="cancelled" className="w-full">
                                        <AdditionalParticipantDialog
                                            open={selectedRegistration !== null}
                                            onClose={() => setSelectedRegistration(null)}
                                            registration={selectedRegistration}
                                        />
                                        {trainingData.cancelledData ? (
                                            <ValidationTrainingTable
                                                data={trainingData.cancelledData}
                                                mode="cancelled"
                                                onShowDetailRegistration={onShowDetailRegistration}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ) : (
                                            <div className="w-full flex justify-center items-center min-h-[120px]">
                                                <LoadingSpinner className="w-10 h-10" />
                                            </div>
                                        )}
                                    </TabsContent>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tabs>
            </div>
        </ProtectedRoute>
    );
};

export default ValidationTrainingClient;