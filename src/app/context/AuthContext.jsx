"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth(app);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const idToken = await currentUser.getIdToken(true);
                localStorage.setItem("token", idToken);

                // Ambil user data dari backend hanya setelah user terdeteksi
                await fetchUserData(idToken);
            } else {
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (token) => {
        try {
            if (!token) throw new Error("No token found");

            let endpoint = "http://localhost:5000/api/user";
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (storedUser) {
                setUser(storedUser);
            } else {
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const userData = await response.json();
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
