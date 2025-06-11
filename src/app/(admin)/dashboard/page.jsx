"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";
import axios from "axios";
import Link from "next/link";
import {
    FaUser,
    FaChalkboardTeacher,
    FaClipboardList,
    FaCheckCircle,
    FaUsers,
    FaGraduationCap,
    FaCertificate,
    FaStar,
    FaMoneyBillWave,
    FaNewspaper,
    FaEye,
    FaUserShield,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";

const DashboardAdmin = () => {
    const [todoCounts, setTodoCounts] = useState([]);
    const [topTrainings, setTopTrainings] = useState([]);
    const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
    const [globalStats, setGlobalStats] = useState({});
    const [trainingOverview, setTrainingOverview] = useState([]);
    const [showGlobalStats, setShowGlobalStats] = useState(false);

    const CustomXAxisTick = ({ x, y, payload }) => {
        const maxCharsPerLine = 12;
        const maxTotalChars = 9;
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
        const fetchTodoCounts = async () => {
            try {
                // ========== PART 1 : Todo ==========
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/todo`);
                const data = res.data.data;

                setTodoCounts({
                    pendingRegistration: parseInt(data.pending_registrations) || 0,
                    completedTraining: parseInt(data.unmarked_attendance) || 0,
                    certificateUpload: parseInt(data.pending_certificates) || 0,
                    certificateValidation: parseInt(data.pending_user_certificates) || 0,
                });

                // ========== PART 2 : Top Training ==========
                const resTrainings = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/top-trainings`);
                setTopTrainings(resTrainings.data.data);

                // ========== PART 3 : Monthly Registration ==========
                const resMonthly = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/monthly-registrations`);
                setMonthlyRegistrations(
                    resMonthly.data.data.map(item => ({
                        ...item,
                        month: item.month,
                        total_participants: parseInt(item.total_participants),
                        total_registrations: parseInt(item.total_registrations),
                    }))
                );

                // ========== PART 4 : Grouped & Stacked Bar ==========
                const resTrainingOverview = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/training-overview`);
                const rawData = resTrainingOverview.data.data;

                const transformedData = rawData.map(item => ({
                    name: item.training_name,
                    completed: item.registration.completed,
                    onprogress: item.registration.onprogress,
                    cancelled: item.registration.cancelled,
                    reg_total: item.registration.total_participants,

                    valid_certificate: item.certificate.valid,
                    expired_certificate: item.certificate.expired,
                    cert_total: item.certificate.total_issued,

                    additionalData: {
                        reg_total: item.registration.total_participants,
                        cert_total: item.certificate.total_issued,
                    }
                }));

                setTrainingOverview(transformedData);

                // ========== PART 5 : Global Stat ==========
                const resGlobalStats = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/summary`);
                setGlobalStats(resGlobalStats.data.data);

            } catch (err) {
                console.error("Error fetching Dashboard Data:", err);
            }
        };

        fetchTodoCounts();
    }, []);

    const CustomTooltip = ({ active, payload, label, dataMap, colorMap }) => {
        if (active && payload?.length) {
            const data = dataMap.find(item => item.name === label);
            return (
                <div className="bg-white p-2 border rounded shadow text-sm">
                    <p className="font-bold text-mainOrange">{label}</p>
                    {data?.additionalData && Object.entries(data.additionalData).map(([key, value]) => (
                        <p key={key} className="font-semibold">
                            {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}: {value}
                        </p>
                    ))}
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

    const iconMap = {
        registered_users: <FaUser className="text-2xl text-blue-500" />,
        active_admin: <FaUserShield className="text-2xl text-mainBlue" />,
        active_trainings: <FaChalkboardTeacher className="text-2xl text-green-500" />,
        training_registrations: <FaClipboardList className="text-2xl text-orange-500" />,
        completed_registrations: <FaCheckCircle className="text-2xl text-emerald-500" />,
        training_participants: <FaUsers className="text-2xl text-purple-500" />,
        training_graduates: <FaGraduationCap className="text-2xl text-indigo-500" />,
        issued_certificates: <FaCertificate className="text-2xl text-teal-500" />,
        training_reviews: <FaStar className="text-2xl text-yellow-500" />,
        training_payments: <FaMoneyBillWave className="text-2xl text-lime-500" />,
        published_articles: <FaNewspaper className="text-2xl text-pink-500" />,
        article_views: <FaEye className="text-2xl text-blue-500" />,
    };

    return (
        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <div className="relative pt-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
                <div
                    className="w-full max-w-6xl mx-auto bg-cover bg-center rounded-xl relative p-4"
                    style={{ backgroundImage: "url('/assets/dashboard-bg.png')" }}
                >
                    <h2 className="w-full text-center text-white font-bold text-xl sm:text-2xl mb-4">
                        To Do's
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: "Pending Registration",
                                value: todoCounts.pendingRegistration,
                                description: "data need to be validated",
                                href: "/validation/training?tab=needprocess",
                            },
                            {
                                title: "Completed Training",
                                value: todoCounts.completedTraining,
                                description: "status need to be reviewed",
                                href: "/validation/training?tab=onprogress",
                            },
                            {
                                title: "Certificate Upload",
                                value: todoCounts.certificateUpload,
                                description: "data need to be uploaded",
                                href: "/validation/training?tab=onprogress",
                            },
                            {
                                title: "Certificate Validation",
                                value: todoCounts.certificateValidation,
                                description: "data need to be validated",
                                href: "/validation/certificate?tab=needprocess",
                            },
                        ].map((card, idx) => (
                            <Link key={idx} href={card.href}>
                                <div className="cursor-pointer h-[200px] bg-white bg-opacity-10 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-4 shadow-[inset_4px_2px_15px_rgba(255,255,255,0.4)]
      transition-transform duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:backdrop-blur-xl">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white text-center">{card.title}</h2>
                                    <p className="text-gray-200 text-5xl sm:text-6xl font-bold drop-shadow-md text-center">{card.value}</p>
                                    <p className="text-gray-200 text-sm sm:text-base text-center">{card.description}</p>
                                </div>
                            </Link>
                        ))
                        }
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mx-auto max-w-[1200px]">
                    <div className="bg-white shadow-md p-4 rounded-lg border border-[#01458E]">
                        <h2 className="text-lg font-semibold text-center mb-2">Top Trainings by Rating</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topTrainings} margin={{ bottom: 30 }}>
                                <XAxis dataKey="training_name" tick={<CustomXAxisTick />} interval={0} />
                                <YAxis />
                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            dataMap={topTrainings.map(item => ({
                                                name: item.training_name,
                                                additionalData: {
                                                    average_rating: item.average_rating
                                                }
                                            }))}
                                            colorMap={{
                                                score_5: "#01458E",
                                                score_4: "#157AB2",
                                                score_3: "#3BAFDA",
                                                score_2: "#7FCFE6",
                                                score_1: "#BDE6F2",
                                            }}
                                        />
                                    }
                                />
                                <Bar dataKey="score_5" stackId="a" fill="#01458E" name="Score 5" />
                                <Bar dataKey="score_4" stackId="a" fill="#157AB2" name="Score 4" />
                                <Bar dataKey="score_3" stackId="a" fill="#3BAFDA" name="Score 3" />
                                <Bar dataKey="score_2" stackId="a" fill="#7FCFE6" name="Score 2" />
                                <Bar dataKey="score_1" stackId="a" fill="#BDE6F2" name="Score 1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow-md p-4 rounded-lg border border-[#01458E]">
                        <h2 className="text-lg font-semibold text-center mb-2">Monthly Registrations</h2>
                        <ResponsiveContainer width="100%" height={300} >
                            <AreaChart data={monthlyRegistrations} margin={{ top: 0, right: 30, left: 0, bottom: 30 }}>
                                <defs>
                                    <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#157AB2" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#157AB2" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#01458E" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#01458E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" tick={<CustomXAxisTick />} interval={0} />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            dataMap={monthlyRegistrations.map(item => ({
                                                name: item.month,
                                            }))}
                                            colorMap={{
                                                total_participants: "#157AB2",
                                                total_registrations: "#01458E",
                                            }}
                                        />
                                    }
                                />
                                <Area type="monotone" dataKey="total_participants" stroke="#157AB2" fillOpacity={1} fill="url(#colorParticipants)" name="Participants" />
                                <Area type="monotone" dataKey="total_registrations" stroke="#01458E" fillOpacity={1} fill="url(#colorRegistrations)" name="Registrations" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Training Overview */}
                <div className="w-full max-w-6xl mx-auto mt-6 bg-white border border-lightBlue rounded-lg shadow-md cursor-pointer p-4" >
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Training Overview</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={trainingOverview} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={<CustomXAxisTick />} interval={0} />
                            <YAxis />
                            <Tooltip
                                content={
                                    <CustomTooltip
                                        dataMap={trainingOverview}
                                        colorMap={{
                                            completed: "#01458E",
                                            onprogress: "#03649F",
                                            cancelled: "#157AB2",
                                            valid_certificate: "#ED7117",
                                            expired_certificate: "#FCAE1E",
                                        }}
                                    />
                                }
                            />
                            <Bar stackId="reg" dataKey="completed" fill="#01458E" name="Completed" />
                            <Bar stackId="reg" dataKey="onprogress" fill="#03649F" name="On Progress" />
                            <Bar stackId="reg" dataKey="cancelled" fill="#157AB2" name="Cancelled" />

                            <Bar stackId="cert" dataKey="valid_certificate" fill="#ED7117" name="Valid Certificate" />
                            <Bar stackId="cert" dataKey="expired_certificate" fill="#FCAE1E" name="Expired Certificate" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Global Review */}
                <div
                    className="w-full max-w-6xl mx-auto mt-6 bg-white border rounded-lg shadow-md cursor-pointer p-4"
                >
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setShowGlobalStats(!showGlobalStats)}
                            className="text-gray-600 hover:text-black focus:outline-none"
                            aria-label="Toggle Global Stats"
                        >
                            <h2 className="text-lg font-semibold">Quick Global Review</h2>
                        </button>
                    </div>
                    {showGlobalStats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                            {Object.entries(globalStats).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="bg-white rounded-xl shadow-sm p-4 text-gray-800 flex flex-col justify-center border hover:shadow-md transition-shadow h-28"
                                >
                                    <div className="flex items-center justify-center mt-1">
                                        <p
                                            className="text-2xl font-semibold text-gray-900 truncate"
                                            title={value}
                                        >
                                            {value}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center mt-1">
                                        <span className="text-gray-400 text-6xl mr-2">
                                            {iconMap[key] || <FaClipboardList />}
                                        </span>
                                        <p className="text-xs text-gray-500 tracking-wide font-medium">
                                            {key.replace(/_/g, " ").toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute >
    );
};

export default DashboardAdmin;