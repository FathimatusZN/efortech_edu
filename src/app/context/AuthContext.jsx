"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "@/app/firebase/config";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => { };

        const checkStoredAuth = async () => {
            setLoading(true);
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedToken) {
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

            setUser(userData);
            localStorage.setItem("token", idToken);
            localStorage.setItem("role", userData.role);
            localStorage.setItem("user", JSON.stringify(userData));

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
        <AuthContext.Provider value={{ user, setUser, updateUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
