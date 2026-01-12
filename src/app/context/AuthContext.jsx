"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const safeParse = (str) => {
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    };

    // ✅ CHECK localStorage SYNC (tidak async)
    const storedUser = safeParse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const loginTime = parseInt(localStorage.getItem("login_time"), 10);
    const maxDuration = parseInt(localStorage.getItem("max_duration"), 10);
    const now = Date.now();

    const isExpired = loginTime && maxDuration && now - loginTime > maxDuration;

    if (isExpired) {
      logout();
      setSessionExpired(true);
      setLoading(false); // ✅ Set loading false IMMEDIATELY
      return;
    }

    // ✅ Jika ada stored user yang valid, set immediately
    if (storedUser && storedToken && !isExpired) {
      setUser(storedUser);
      // JANGAN set loading false di sini, tunggu Firebase verify
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken(true);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
            {
              headers: { Authorization: `Bearer ${idToken}` },
            }
          );

          setUser(res.data.data);
          localStorage.setItem("user", JSON.stringify(res.data.data));
          localStorage.setItem("token", idToken);
        } catch (err) {
          logout();
        }
      } else {
        // ✅ Hanya logout jika memang tidak ada stored user
        if (!storedUser || isExpired) {
          logout();
        }
      }

      // ✅ CRITICAL: Set loading false setelah check selesai
      setLoading(false);
    });

    // ✅ FALLBACK: Jika onAuthStateChanged tidak dipanggil dalam 3 detik
    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        { idToken }
      );

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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        login,
        logout,
        loading,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
