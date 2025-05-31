"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "@/app/firebase/config";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        let unsubscribe = () => { };

        const checkStoredAuth = async () => {
            setLoading(true);
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            const loginTime = parseInt(localStorage.getItem("login_time"), 10);
            const maxDuration = parseInt(localStorage.getItem("max_duration"), 10);
            const now = Date.now();

            const isExpired = loginTime && maxDuration && now - loginTime > maxDuration;

            if (isExpired) {
                logout(); // Clear user and token if expired
                setSessionExpired(true);
                setLoading(false);
                return;
            }

            if (storedUser && storedToken && !isExpired) {
                setUser(JSON.parse(storedUser));
            }

            unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    try {
                        const idToken = await currentUser.getIdToken(true);
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
                            headers: { Authorization: `Bearer ${idToken}` }
                        });
                        setUser(res.data.data);
                        localStorage.setItem("user", JSON.stringify(res.data.data));
                        localStorage.setItem("token", idToken);
                    } catch (err) {
                        console.error("Error fetching user data", err);
                        logout();
                    }
                } else {
                    logout();
                }
                setLoading(false);
            });
        };

        checkStoredAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken(true);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, { idToken });

            const userData = res.data.data;

            // Set max duration for localStorage login
            const now = Date.now();
            const duration = 3 * 60 * 60 * 1000;

            // Save to localStorage
            localStorage.setItem("token", idToken);
            localStorage.setItem("role", userData.role);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("login_time", now.toString());
            localStorage.setItem("max_duration", duration.toString());

            setUser(userData);

            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("login_time");
            localStorage.removeItem("max_duration");
            localStorage.removeItem("role");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const updateUser = (updatedData) => {
        setUser((prev) => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user, setUser, updateUser, login, logout, loading,
            sessionExpired,
            setSessionExpired,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
