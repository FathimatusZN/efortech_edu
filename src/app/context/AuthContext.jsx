"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Buat context untuk Auth
const AuthContext = createContext();

// Provider untuk membungkus seluruh aplikasi
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State untuk user

    // Simulasi Fetch User (nanti bisa diganti API)
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // Fungsi login sementara (nanti diganti API)
    const login = (role) => {
        const userData = { name: "User", role: role };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Fungsi logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk pakai AuthContext
export const useAuth = () => useContext(AuthContext);
