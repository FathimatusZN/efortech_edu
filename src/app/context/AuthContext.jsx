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
        const checkStoredAuth = async () => {
            setLoading(true);
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            } else {
                // Jalankan Firebase Auth Listener
                const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                    if (currentUser) {
                        const idToken = await currentUser.getIdToken(true);

                        try {
                            const res = await axios.get("http://localhost:5000/api/user/me", {
                                headers: { Authorization: `Bearer ${idToken}` }
                            });
                            setUser(res.data);
                            localStorage.setItem("user", JSON.stringify(res.data));
                            localStorage.setItem("token", idToken);
                        } catch (error) {
                            console.error("Error fetching user data", error);
                            setUser(null);
                            localStorage.removeItem("user");
                            localStorage.removeItem("token");
                        }
                    } else {
                        setUser(null);
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                    }
                    setLoading(false);
                });

                return () => unsubscribe();
            }
        };

        checkStoredAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Firebase Auth sukses:", userCredential);

            const user = userCredential.user;
            const idToken = await user.getIdToken(true);
            console.log("✅ Firebase ID Token:", idToken);

            console.log("🚀 Mengirim token ke backend...");
            const res = await axios.post("http://localhost:5000/api/auth/login", { idToken });

            console.log("✅ Backend response:", res.data);
            setUser(res.data.user);
            sessionStorage.setItem("token", idToken);
            sessionStorage.setItem("role", res.data.user.role);
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

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


/* 
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

*/