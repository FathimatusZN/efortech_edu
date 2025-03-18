"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardAdmin = () => {
    const registrantData = [
        { name: "Jan", count: 120 },
        { name: "Feb", count: 150 },
        { name: "Mar", count: 170 },
        { name: "Apr", count: 90 },
        { name: "May", count: 200 },
    ];

    const certificateData = [
        { name: "Jan", count: 50 },
        { name: "Feb", count: 80 },
        { name: "Mar", count: 100 },
        { name: "Apr", count: 40 },
        { name: "May", count: 150 },
    ];

    return (
        <div className="relative pt-4 px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

            <div className="w-full max-w-4xl mx-auto bg-cover bg-center rounded-xl relative flex flex-wrap justify-center items-center gap-4 p-4"
                style={{ backgroundImage: "url('/assets/dashboard-bg.png')" }}>
                {/* Title "To Do's" */}
                <h1 className="w-full text-center text-white font-bold text-xl sm:text-2xl mb-4">
                    To Do's
                </h1>

                {/* Glassmorphism Shapes */}
                <div className="w-full sm:w-[45%] h-[200px] bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Training Registrations</h2>
                    <p className="text-gray-200 text-5xl sm:text-6xl font-bold drop-shadow-md">
                        14
                    </p>
                    <p className="text-gray-200 text-sm sm:text-base">data need to be validated</p>
                </div>
                <div className="w-full sm:w-[45%] h-[200px] bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Training Certificate</h2>
                    <p className="text-gray-200 text-5xl sm:text-6xl font-bold drop-shadow-md">
                        20
                    </p>
                    <p className="text-gray-200 text-sm sm:text-base">data need to be validated</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-auto max-w-5xl">
                {/* Registrant Chart */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2 text-center">Registrant Overview</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={registrantData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#01458E" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Certificate Chart */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2 text-center">Certificate Issued</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={certificateData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#01458E" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
