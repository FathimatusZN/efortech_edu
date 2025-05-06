"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import Link from "next/link";

const DashboardAdmin = () => {
    const [registrantData, setRegistrantData] = useState([]);
    const [certificateData, setCertificateData] = useState([]);

    const CustomXAxisTick = ({ x, y, payload }) => {
        const maxCharsPerLine = 12;
        const maxTotalChars = 21;
        const fullText = payload.value;
        const text = fullText.length > maxTotalChars ? fullText.slice(0, maxTotalChars) + "..." : fullText;

        const lines = [];
        for (let i = 0; i < text.length; i += maxCharsPerLine) {
            lines.push(text.slice(i, i + maxCharsPerLine));
        }

        return (
            <g transform={`translate(${x},${y + 10}) rotate(-40)`}>
                <title>{fullText}</title>
                <text textAnchor="end" fontSize={10} fill="#333">
                    {lines.map((line, index) => (
                        <tspan key={index} x={0} dy={index === 0 ? 0 : 12}>
                            {line}
                        </tspan>
                    ))}
                </text>
            </g>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch registrant data
                const regRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration/search?sort_by=participant_count&sort_order=DESC`);
                const registrations = regRes.data.data;

                // Grouping by training_name with status breakdown
                const grouped = {};
                for (const reg of registrations) {
                    const name = reg.training_name;
                    const status = reg.status;

                    if (!grouped[name]) {
                        grouped[name] = {
                            name,
                            progressCount: 0,
                            completedCount: 0,
                            cancelledCount: 0,
                        };
                    }

                    const count = reg.participant_count || 1;

                    if ([1, 2, 3].includes(status)) grouped[name].progressCount += count;
                    else if (status === 4) grouped[name].completedCount += count;
                    else if (status === 5) grouped[name].cancelledCount += count;

                    grouped[name].total = (grouped[name].total || 0) + count;
                }

                const registrantChartData = Object.values(grouped)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 10);

                setRegistrantData(registrantChartData);

                // Fetch certificate data
                const certRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate`);
                const certificateGrouped = {};

                // Group by training_name and status certificate
                certRes.data.data.forEach(cert => {
                    const trainingName = cert.training_name;
                    const status = cert.status_certificate;

                    if (!certificateGrouped[trainingName]) {
                        certificateGrouped[trainingName] = {
                            name: trainingName,
                            validCount: 0,
                            expiredCount: 0,
                            total: 0,
                        };
                    }

                    certificateGrouped[trainingName].total += 1;
                    if (status === "Valid") {
                        certificateGrouped[trainingName].validCount += 1;
                    } else if (status === "Expired") {
                        certificateGrouped[trainingName].expiredCount += 1;
                    }
                });

                const certificateChartData = Object.values(certificateGrouped)
                    .map(item => ({
                        name: item.name,
                        validCount: item.validCount,
                        expiredCount: item.expiredCount,
                        total: item.total,
                    }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 10);

                setCertificateData(certificateChartData);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };

        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload, label, dataMap, colorMap }) => {
        if (active && payload && payload.length) {
            const data = dataMap.find(item => item.name === label);
            return (
                <div className="bg-white p-2 border rounded shadow text-sm">
                    <p className="font-semibold">{label}</p>
                    <p className="font-medium">Total: {data?.total || 0}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="font-medium" style={{ color: colorMap[entry.dataKey] || "#000" }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

                {/* To Do's Section */}
                <div
                    className="w-full max-w-6xl mx-auto bg-cover bg-center rounded-xl relative p-4"
                    style={{ backgroundImage: "url('/assets/dashboard-bg.png')" }}
                >
                    <h2 className="w-full text-center text-white font-bold text-xl sm:text-2xl mb-4">
                        To Do's
                    </h2>
                    {/* To Do's Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: "Pending Registration",
                                value: 14,
                                description: "data need to be validated",
                                href: "/validation/training?tab=needprocess",
                            },
                            {
                                title: "Completed Training",
                                value: 20,
                                description: "data need to be validated",
                                href: "/validation/training?tab=onprogress",
                            },
                            {
                                title: "Certificate",
                                value: 20,
                                description: "data need to be upload",
                                href: "/validation/training?tab=onprogress",
                            },
                            {
                                title: "Certificate",
                                value: 20,
                                description: "data need to be validated",
                                href: "/validate/certificate",
                            },
                        ].map((card, idx) => (
                            <Link key={idx} href={card.href}>
                                <div className="cursor-pointer h-[200px] bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center justify-center p-4 shadow-[inset_4px_2px_15px_rgba(255,255,255,0.4)]
      transition-transform duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:backdrop-blur-xl">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white">{card.title}</h2>
                                    <p className="text-gray-200 text-5xl sm:text-6xl font-bold drop-shadow-md">{card.value}</p>
                                    <p className="text-gray-200 text-sm sm:text-base">{card.description}</p>
                                </div>
                            </Link>
                        ))
                        }
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mx-auto max-w-[1200px]">
                    {/* Registrant Overview */}
                    <div className="bg-white shadow-md p-4 rounded-lg border border-[#01458E]">
                        <h2 className="text-lg font-semibold mb-2 text-center">Registrant Overview</h2>
                        <p className="text-sm text-center text-gray-500 mb-2">
                            Total: {registrantData.reduce((acc, item) => acc + item.progressCount + item.completedCount + item.cancelledCount, 0)} registrants
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={registrantData} margin={{ bottom: 30 }}>
                                <XAxis dataKey="name" tick={<CustomXAxisTick />} interval={0} />
                                <YAxis />
                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            dataMap={registrantData}
                                            colorMap={{
                                                completedCount: "#01458E",
                                                progressCount: "#157AB2",
                                                cancelledCount: "#D9D9D9",
                                            }}
                                        />
                                    }
                                />

                                <Bar dataKey="completedCount" name="Completed" stackId="a" fill="#01458E" />
                                <Bar dataKey="progressCount" name="On Progress" stackId="a" fill="#157AB2" />
                                <Bar dataKey="cancelledCount" name="Cancelled" stackId="a" fill="#D9D9D9" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Certificate Issued */}
                    <div className="bg-white shadow-md p-4 rounded-lg border border-[#01458E]">
                        <h2 className="text-lg font-semibold text-center mb-2">Certificate Issued</h2>
                        <p className="text-sm text-center text-gray-500 mb-2">
                            Total: {certificateData.reduce((acc, item) => acc + item.total, 0)} certificates
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={certificateData} margin={{ bottom: 30 }}>
                                <XAxis dataKey="name" tick={<CustomXAxisTick />} interval={0} />
                                <YAxis />
                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            dataMap={certificateData}
                                            colorMap={{
                                                validCount: "#01458E",
                                                expiredCount: "#157AB2",
                                            }}
                                        />
                                    }
                                />
                                <Bar dataKey="validCount" name="Valid" stackId="a" fill="#01458E" />
                                <Bar dataKey="expiredCount" name="Expired" stackId="a" fill="#157AB2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardAdmin;
