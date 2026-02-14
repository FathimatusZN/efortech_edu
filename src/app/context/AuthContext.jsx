// efortech_edu\src\app\context\AuthContext.jsx
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

    const storedUser = safeParse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const loginTime = parseInt(localStorage.getItem("login_time"), 10);
    const maxDuration = parseInt(localStorage.getItem("max_duration"), 10);
    const now = Date.now();

    const isExpired = loginTime && maxDuration && now - loginTime > maxDuration;

    if (isExpired) {
      logout();
      setSessionExpired(true);
      setLoading(false);
      return;
    }

    if (storedUser && storedToken && !isExpired) {
      setUser(storedUser);
      setLoading(false);
    }

    let isUnsubscribed = false;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (isUnsubscribed) return;

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken(true);

          let retries = 3;
          let res;

          while (retries > 0 && !isUnsubscribed) {
            try {
              res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
                {
                  headers: { Authorization: `Bearer ${idToken}` },
                  timeout: 10000,
                }
              );
              break;
            } catch (err) {
              retries--;
              if (retries === 0) throw err;
              await new Promise(r => setTimeout(r, 1000));
            }
          }

          if (isUnsubscribed) return;

          const userData = res.data.data;

          const now = Date.now();
          const duration = 3 * 60 * 60 * 1000;

          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", idToken);
          localStorage.setItem("login_time", now.toString());
          localStorage.setItem("max_duration", duration.toString());

          setUser(userData);
          setLoading(false);

        } catch (err) {
          console.error("Failed to fetch user data:", err);

          if (!storedUser) {
            logout();
          }
          setLoading(false);
        }
      } else {
        if (!storedUser || isExpired) {
          logout();
        }
        setLoading(false);
      }
    });

    const fallbackTimeout = setTimeout(() => {
      if (!isUnsubscribed) {
        console.warn("Auth state check timeout - setting loading to false");
        setLoading(false);
      }
    }, 10000);

    return () => {
      isUnsubscribed = true;
      clearTimeout(fallbackTimeout);
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        { idToken }
      );

      const userData = res.data.data;
      const now = Date.now();
      const duration = 3 * 60 * 60 * 1000;

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
      console.error("Logout error:", error);
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