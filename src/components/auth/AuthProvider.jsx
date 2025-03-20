"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const token = await currentUser.getIdToken();
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    role: sessionStorage.getItem("role") || "user",
                    token
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        sessionStorage.removeItem("role");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
