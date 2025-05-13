//efortech_edu\src\app\(admin)\certificate-admin\page.jsx

"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CertificateTable from "@/components/admin/CertificateTable";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { Checkbox } from '@/components/ui/checkbox';
import { FaFilter } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

const CertificatePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get("tab") || "allcertificate";
    const [tab, setTab] = useState(initialTab);

    const handleTabChange = (newTab) => {
        setTab(newTab);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", newTab);
        router.push(`/certificate-admin?${params.toString()}`);
    };

    const [certificateData, setCertificateData] = useState({
        allCertificateData: null,
        trainingCertificateData: null,
        userUploadCertificateData: null
    });
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const sortRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortOpen, setSortOpen] = useState(false);
    const [tempSortField, setTempSortField] = useState(sortBy);
    const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
    const [searchInput, setSearchInput] = useState("");
    const filterRefProcessed = useRef(null);

    const [selectedFilters, setSelectedFilters] = useState({
        allcertificate: { validity_status: ["Valid", "Expired"] },
        trainingcertificate: { validity_status: ["Valid", "Expired"] },
        useruploadcertificate: { validity_status: ["Valid", "Expired"] }
    });

    const tabConfig = {
        allcertificate: {
            url: "/api/certificates/search",
            key: "allCertificateData",
            searchFields: ["type", "certificate_number", "fullname", "certificate_title", "issued_date", "expired_date"],
            filters: {
                validity_status: ["Valid", "Expired"],
            },
            sortFields: ["certificate_number", "fullname", "certificate_title", "issued_date", "expired_date"],
        },
        trainingcertificate: {
            url: "/api/certificates/search?type=1",
            key: "trainingCertificateData",
            searchFields: ["type", "certificate_number", "fullname", "certificate_title", "issued_date", "expired_date"],
            filters: {
                validity_status: ["Valid", "Expired"],
            },
            sortFields: ["certificate_number", "fullname", "certificate_title", "issued_date", "expired_date"],
        },
        useruploadcertificate: {
            url: "/api/certificates/search?type=2",
            key: "userUploadCertificateData",
            searchFields: ["type", "certificate_number", "fullname", "certificate_title", "issued_date", "expired_date"],
            filters: {
                validity_status: ["Valid", "Expired"],
            },
            sortFields: ["certificate_number", "fullname", "certificate_title", "issued_date", "expired_date"],
        },
    };

    const buildQueryParams = () => {
        const config = tabConfig[tab];
        const params = new URLSearchParams();

        const urlObj = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}${config.url}`);
        const baseURL = urlObj.pathname;

        urlObj.searchParams.forEach((value, key) => {
            params.append(key, value);
        });

        if (searchQuery) params.append("q", searchQuery);

        const rawStatus = selectedFilters[tab].validity_status || [];
        const uniqueStatus = [...new Set(rawStatus)];
        uniqueStatus.forEach((statusCode) => {
            if (statusCode) params.append("validity_status", statusCode);
        });

        if (sortBy) params.append("sort_by", sortBy);
        if (sortOrder) params.append("sort_order", sortOrder);

        Object.entries(selectedFilters[tab]).forEach(([key, value]) => {
            if (key !== "validity_status") {
                if (Array.isArray(value)) {
                    [...new Set(value)].forEach((val) => params.append(key, val));
                } else if (value) {
                    params.append(key, value);
                }
            }
        });

        return `${baseURL}?${params.toString()}`;
    };

    const fetchTabData = async (tabKey = tab) => {
        const config = tabConfig[tabKey];
        if (!config) return;

        setLoading(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${buildQueryParams()}`;
            console.log(`fetch tab : ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error();

            const result = await response.json();
            const data = result?.data || [];

            setCertificateData((prev) => ({
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
        if (!certificateData[`${tabConfig[tab]?.key}`]) {
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
        let defaultSortBy = "issued_date";
        let defaultSortOrder = "DESC";

        setSortBy(defaultSortBy);
        setSortOrder(defaultSortOrder);

        defaultFilter.validity_status = [""];

        // ensure validity_status key always exists (even empty)
        if (!defaultFilter.validity_status) {
            defaultFilter.validity_status = [];
        }

        setSelectedFilters((prev) => ({
            ...prev,
            [tab]: defaultFilter,
        }));
    }, [tab]);

    // Function to handle showing preview in a dialog
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const onShowDetailCertificate = (certificate) => {
        setSelectedCertificate(certificate);
        setIsDetailDialogOpen(true);
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
                    All Certificates Data
                </h1>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                    <div className="bg-white overflow-hidden">
                        {/* Tabs Header and Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                            {/* Tabs */}
                            <TabsList className="flex flex-wrap gap-2">
                                <TabsTrigger value="allcertificate">All Certificates</TabsTrigger>
                                <TabsTrigger value="trainingcertificate">Training Registration Certificates</TabsTrigger>
                                <TabsTrigger value="useruploadcertificate">User Upload Certificates</TabsTrigger>
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
                                            {currentConfig.filters?.validity_status?.map((statusCode) => (
                                                <div key={statusCode} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`validity_status-${statusCode}`}
                                                        checked={selectedFilters[tab].validity_status?.includes(statusCode) || false}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedFilters((prev) => {
                                                                const currentStatus = prev[tab]?.validity_status || [];
                                                                const updatedStatus = checked
                                                                    ? [...currentStatus, statusCode]
                                                                    : currentStatus.filter((status) => status !== statusCode);

                                                                return {
                                                                    ...prev,
                                                                    [tab]: {
                                                                        ...prev[tab],
                                                                        validity_status: updatedStatus
                                                                    }
                                                                };
                                                            });
                                                        }}
                                                    />
                                                    <label htmlFor={`validity_status-${statusCode}`}>
                                                        {`${statusCode}`}
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
                                <div className="items-center justify-between">
                                    {/* All Certificate Tab */}
                                    <TabsContent value="allcertificate">
                                        {certificateData.allCertificateData ? (
                                            <CertificateTable
                                                data={certificateData.allCertificateData}
                                                mode="needprocess"
                                                mode2="all"
                                                onShowDetailCertificate={onShowDetailCertificate}
                                            />
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </TabsContent>

                                    {/* Training Registration Certificate Tab */}
                                    <TabsContent value="trainingcertificate">
                                        {certificateData.trainingCertificateData ? (
                                            <CertificateTable
                                                data={certificateData.trainingCertificateData}
                                                mode="needprocess"
                                                onShowDetailCertificate={onShowDetailCertificate}
                                            />
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </TabsContent>

                                    {/* User Upload Certificate Tab */}
                                    <TabsContent value="useruploadcertificate">
                                        {certificateData.userUploadCertificateData ? (
                                            <CertificateTable
                                                data={certificateData.userUploadCertificateData}
                                                mode="needprocess"
                                                onShowDetailCertificate={onShowDetailCertificate}
                                            />
                                        ) : (
                                            <p>Loading...</p>
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
}

export default CertificatePage;