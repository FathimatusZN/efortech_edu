"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

interface ProfileContextType {
  loading: boolean;
  isComplete: boolean | null;
  missingFields: string[];
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ✅ PINDAHKAN KE SINI - Di luar component
const AUTH_PAGES = [
  "/auth/login",
  "/auth/signin",
  "/auth/register",
  "/auth/signup",
  "/auth/forgot-password",
];

export function ProfileProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const hasChecked = useRef(false);
  const lastCheckedUserId = useRef<string | null>(null);

  const checkProfile = async () => {
    // Jika tidak ada user
    if (!user) {
      setLoading(false);
      setIsComplete(null);
      hasChecked.current = false;
      lastCheckedUserId.current = null;
      return;
    }

    // ✅ PERBAIKAN: Check berbagai kemungkinan field untuk user ID
    const userId = user.id || user.user_id || user.uid || user.userId;

    // Jika user ID belum ada
    if (!userId) {
      setLoading(false);
      return;
    }

    // Skip jika sudah pernah check user ini
    if (hasChecked.current && lastCheckedUserId.current === userId) {
      return;
    }

    // Admin selalu complete
    if (user.role === "admin" || user.role === "superadmin") {
      setIsComplete(true);
      setMissingFields([]);
      setLoading(false);
      hasChecked.current = true;
      lastCheckedUserId.current = userId;
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setIsComplete(false);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const json = await res.json();

      const data = json?.data || {};

      const complete = data.isComplete === true || data.isComplete === 1;

      setIsComplete(complete);
      setMissingFields(
        Array.isArray(data.missingFields) ? data.missingFields : []
      );

      hasChecked.current = true;
      lastCheckedUserId.current = userId;
    } catch (e) {
      setIsComplete(false);
      setMissingFields([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check profile saat authLoading selesai DAN user berubah
  useEffect(() => {
    // Tunggu auth selesai
    if (authLoading) {
      return;
    }

    // Jika tidak ada user, set loading false
    if (!user) {
      setLoading(false);
      setIsComplete(null);
      hasChecked.current = false;
      lastCheckedUserId.current = null;
      return;
    }
    checkProfile();
  }, [authLoading, user]);

  // Handle redirect
  useEffect(() => {
    // Tunggu sampai loading selesai
    if (authLoading || loading) {
      return;
    }

    // Jika tidak ada user
    if (!user) {
      return;
    }

    // Jika masih null, tunggu
    if (isComplete === null) {
      return;
    }

    const isOnAuthPage = AUTH_PAGES.includes(pathname);
    const isOnCompleteProfilePage = pathname === "/complete-profile";

    // ✅ LOGIC BARU: Lebih jelas dan terstruktur

    // 1. Jika profile COMPLETE
    if (isComplete === true) {
      // Jika di auth page atau complete-profile page → redirect ke home
      if (isOnAuthPage || isOnCompleteProfilePage) {
        router.replace("/home");
        return;
      }
      return;
    }

    // 2. Jika profile INCOMPLETE
    if (isComplete === false) {
      // ✅ JIKA MASIH DI AUTH PAGE → LANGSUNG KE COMPLETE-PROFILE
      if (isOnAuthPage) {
        router.replace("/complete-profile");
        return;
      }

      // Jika bukan di complete-profile → redirect
      if (!isOnCompleteProfilePage) {
        router.replace("/complete-profile");
        return;
      }
      return;
    }
  }, [user, isComplete, loading, authLoading, pathname, router]);

  const refetch = async () => {
    hasChecked.current = false;
    lastCheckedUserId.current = null;
    await checkProfile();
  };

  return (
    <ProfileContext.Provider
      value={{ loading, isComplete, missingFields, refetch }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
}
