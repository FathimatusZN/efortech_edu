"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidationTrainingTable } from "@/components/admin/ValidationTrainingTable";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AdditionalParticipantDialog } from "@/components/admin/AdditionalParticipantDialog";
import { FaSearch } from "react-icons/fa";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

const ValidationTrainingPage = () => {
    const [tab, setTab] = useState("needprocess");
    const [trainingData, setTrainingData] = useState({
        needProcessData: null,
        onProgressData: null,
        completedData: null,
        canceledData: null,
    });
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const filterRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState({});

    // Fetch training data 
    const fetchTabData = async (tabKey) => {
        setLoading(true);
        try {
            let response;
            switch (tabKey) {
                case "needprocess":
                    response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/search?status=1,2,3`);
                    if (!response.ok) throw new Error();
                    const needProcess = (await response.json()).data || [];
                    setTrainingData((prev) => ({ ...prev, needProcessData: needProcess }));
                    break;

                case "onprogress":
                    response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollment/participants`);
                    if (!response.ok) throw new Error();
                    const onProgress = (await response.json()).data || [];
                    setTrainingData((prev) => ({ ...prev, onProgressData: onProgress }));
                    break;

                // case "completed":
                // case "canceled":
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data for tab: " + tabKey);
        } finally {
            setLoading(false);
        }
    };

    // Default load
    useEffect(() => {
        fetchTabData("needprocess");
    }, []);

    // Fetch data for the selected tab when the component mounts or when the tab changes
    useEffect(() => {
        if (!trainingData[`${tab}Data`]) {
            fetchTabData(tab);
        }
    }, [tab]);

    // Function to handle showing participants in a dialog
    const onShowParticipants = (participants) => {
        setSelectedParticipants(participants);
        setIsDialogOpen(true);
    };

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

            setTrainingData((prev) => {
                const updatedNeed = prev.needProcessData.filter(
                    (item) => item.registration_id !== registrationId
                );
                const updatedOnProgress = [...prev.onProgressData];

                const originalItem = prev.needProcessData.find(
                    (item) => item.registration_id === registrationId
                );

                const updatedItem = {
                    ...originalItem,
                    status: newStatus,
                    validation: newStatus,
                };

                if (newStatus === 4) {
                    return {
                        needProcessData: updatedNeed,
                        onProgressData: [...updatedOnProgress, updatedItem],
                    };
                } else {
                    return {
                        needProcessData: [...prev.needProcessData.map((item) =>
                            item.registration_id === registrationId ? updatedItem : item
                        )],
                        onProgressData: [...prev.onProgressData],
                    };
                }
            });

            toast.success("Status updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Error updating status");
        }
    };

    // Function to handle click outside the filter dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to handle attendance status change
    const handleAttendanceClick = async (id, status) => {
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

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="max-w-screen mx-auto p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-left">
                    Training Registration Validation
                </h1>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <div className="bg-white overflow-hidden">
                        {/* Tabs Header and Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                            {/* Tabs */}
                            <TabsList className="flex flex-wrap gap-2">
                                <TabsTrigger value="needprocess">Need to Process</TabsTrigger>
                                <TabsTrigger value="onprogress">On Progress</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="canceled">Canceled</TabsTrigger>
                            </TabsList>

                            {/* Filter and Search */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                                {/* Search Input */}
                                <div className="relative w-full sm:w-[250px]">
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="text-sm w-full pl-6 pr-10 py-2 rounded-md border border-mainBlue focus:ring-0 focus:outline-none"
                                    />
                                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>

                                {/* Sort Dropdown */}
                                <Select
                                    onValueChange={(value) => {
                                        if (value === "name") {
                                            setTrainingData((prev) => ({
                                                ...prev,
                                                needProcessData: [...prev.needProcessData].sort((a, b) =>
                                                    a.fullName.localeCompare(b.fullName)
                                                ),
                                            }));
                                        } else if (value === "date") {
                                            setTrainingData((prev) => ({
                                                ...prev,
                                                needProcessData: [...prev.needProcessData].sort((a, b) =>
                                                    new Date(a.requestDate) - new Date(b.requestDate)
                                                ),
                                            }));
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-[180px] border border-mainBlue rounded-md text-sm">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="date">Registration Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 mt-2" />

                        <div className="p-1 mt-2 mr-1">
                            <div className="bg-white outline outline-3 outline-mainBlue rounded-2xl px-4 py-2 mb-4 shadow-[8px_8px_0px_0px_#157ab2] overflow-x-auto">
                                <div className="flex items-center justify-between">
                                    {/* Need to be process tab */}
                                    <TabsContent value="needprocess">
                                        <AdditionalParticipantDialog
                                            open={isDialogOpen}
                                            participants={selectedParticipants}
                                            onClose={() => setIsDialogOpen(false)}
                                        />
                                        {trainingData.needProcessData ? (
                                            <ValidationTrainingTable
                                                data={trainingData.needProcessData}
                                                mode="needToProcess"
                                                onShowParticipants={onShowParticipants}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </TabsContent>

                                    {/* On Progress tab */}
                                    <TabsContent value="onprogress">
                                        {trainingData.onProgressData ? (
                                            <ValidationTrainingTable
                                                data={trainingData.onProgressData}
                                                mode="onprogress"
                                                onAttendanceClick={handleAttendanceClick}
                                            />
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="completed">
                                        <h2 className="text-lg md:text-xl font-semibold mb-4">Completed</h2>
                                        {/* Konten lainnya */}
                                    </TabsContent>

                                    <TabsContent value="canceled">
                                        <h2 className="text-lg md:text-xl font-semibold mb-4">Cancelled</h2>
                                        {/* Konten lainnya */}
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

export default ValidationTrainingPage;