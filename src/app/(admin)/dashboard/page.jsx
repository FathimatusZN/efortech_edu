"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardAdmin = () => {
    const registrantData = [
        { name: "WISE-PaaS Core Level I", count: 150 },
        { name: "WISE-PaaS Core Level II", count: 120 },
        { name: "WISE-4000/LAN Wireless I/O Module Series - Basic", count: 170 },
        { name: "IoT Gateway for Seamless OT-IT Integration", count: 90 },
        { name: "WebAccess/SCADA v9.0 Basic", count: 200 },
    ];

    const certificateData = [
        { name: "WISE-PaaS Core Level I", count: 142 },
        { name: "WISE-PaaS Core Level II", count: 110 },
        { name: "WISE-4000/LAN Wireless I/O Module Series - Basic", count: 167 },
        { name: "IoT Gateway for Seamless OT-IT Integration", count: 85 },
        { name: "WebAccess/SCADA v9.0 Basic", count: 196 },
    ];

    const CustomXAxisTick = ({ x, y, payload }) => {
        const words = payload.value.split(" ");
        const maxCharsPerLine = 15;
        const lines = [];
        let line = words[0];

        for (let i = 1; i < words.length; i++) {
            if ((line + " " + words[i]).length <= maxCharsPerLine) {
                line += " " + words[i];
            } else {
                lines.push(line);
                line = words[i];
            }
        }
        lines.push(line);

        return (
            <text x={x} y={y + 10} textAnchor="middle" fontSize={10} fill="#333">
                {lines.map((line, index) => (
                    <tspan key={index} x={x} dy={index === 0 ? 0 : 12}>{line}</tspan>
                ))}
            </text>
        );
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

                <div className="w-full max-w-4xl mx-auto bg-cover bg-center rounded-xl relative flex flex-wrap justify-center items-center gap-4 p-4"
                    style={{ backgroundImage: "url('/assets/dashboard-bg.png')" }}>
                    {/* Title "To Do's" */}
                    <h1 className="w-full text-center text-white font-bold text-xl sm:text-2xl">
                        To Do's
                    </h1>

                    {/* Glassmorphism Shapes */}
                    <div className="w-full sm:w-[45%] h-[200px] bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center justify-center p-4 shadow-[inset_4px_2px_15px_rgba(255,255,255,0.4)]">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Training Registrations</h2>
                        <p className="text-gray-200 text-5xl sm:text-6xl font-bold drop-shadow-md">
                            14
                        </p>
                        <p className="text-gray-200 text-sm sm:text-base">data need to be validated</p>
                    </div>
                    <div className="w-full sm:w-[45%] h-[200px] bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center justify-center p-4 shadow-[inset_4px_2px_15px_rgba(255,255,255,0.4)]">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Training Certificate</h2>
                        <p className="text-gray-200 text-5xl sm:text-6xl font-bold drop-shadow-md">
                            20
                        </p>
                        <p className="text-gray-200 text-sm sm:text-base">data need to be validated</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mx-auto max-w-[1200px]">
                    {/* Registrant Chart */}
                    <div className="bg-white shadow-md p-4 rounded-lg border border-[#01458E]">
                        <h2 className="text-lg font-semibold mb-4 text-center">Registrant Overview</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={registrantData} margin={{ bottom: 30 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={<CustomXAxisTick />}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#01458E" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Certificate Chart */}
                    <div className="bg-white shadow-md p-4 rounded-lg border border-[#01458E]">
                        <h2 className="text-lg font-semibold mb-4 text-center">Certificate Issued</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={certificateData} margin={{ bottom: 30, left: 10, right: 10 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={<CustomXAxisTick />}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#01458E" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardAdmin;
