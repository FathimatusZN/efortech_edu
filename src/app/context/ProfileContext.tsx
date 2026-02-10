// efortech_edu\src\app\context\ProfileContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
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
  const checkAttempts = useRef(0);

  const checkProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setIsComplete(null);
      hasChecked.current = false;
      lastCheckedUserId.current = null;
      checkAttempts.current = 0;
      return;
    }

    const userId = user.id || user.user_id || user.uid || user.userId;
    if (!userId) {
      console.warn("No user ID found, waiting...");

      if (checkAttempts.current < 5) {
        checkAttempts.current++;
        setTimeout(() => checkProfile(), 500);
        return;
      }

      setLoading(false);
      return;
    }

    if (hasChecked.current && lastCheckedUserId.current === userId) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, waiting...");

      if (checkAttempts.current < 5) {
        checkAttempts.current++;
        setTimeout(() => checkProfile(), 500);
        return;
      }

      setIsComplete(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      console.log("Checking profile for user:", userId);

      let retries = 3;
      let res: Response | undefined;

      while (retries > 0) {
        try {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (res.ok) break;

          retries--;
          if (retries === 0)
            throw new Error(`Profile check failed: ${res.status}`);

          await new Promise((r) => setTimeout(r, 1000));
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      if (!res || !res.ok) {
        console.error("Profile check failed:", res?.status);
        throw new Error("Failed to fetch profile");
      }

      const json = await res.json();
      const data = json?.data || {};

      console.log("Profile data:", data);

      setIsComplete(data.isComplete === true || data.isComplete === 1);
      setMissingFields(
        Array.isArray(data.missingFields) ? data.missingFields : [],
      );

      hasChecked.current = true;
      lastCheckedUserId.current = userId;
      checkAttempts.current = 0;
    } catch (err) {
      console.error("Profile check error:", err);
      setIsComplete(false);
      setMissingFields([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setLoading(false);
      setIsComplete(null);
      hasChecked.current = false;
      lastCheckedUserId.current = null;
      checkAttempts.current = 0;
      return;
    }

    checkProfile();
  }, [authLoading, user, checkProfile]);

  useEffect(() => {
    if (authLoading || loading) {
      return;
    }

    if (!user) {
      return;
    }

    if (isComplete === null) {
      return;
    }

    const isOnAuthPage = AUTH_PAGES.includes(pathname);
    const isOnCompleteProfilePage = pathname === "/complete-profile";

    if (isComplete === true) {
      if (isOnAuthPage || isOnCompleteProfilePage) {
        console.log("Profile complete, redirecting to /home");
        router.replace("/home");
        return;
      }
      return;
    }

    if (isComplete === false) {
      if (isOnAuthPage) {
        console.log("Profile incomplete, redirecting to /complete-profile");
        router.replace("/complete-profile");
        return;
      }

      if (!isOnCompleteProfilePage) {
        console.log("Profile incomplete, redirecting to /complete-profile");
        router.replace("/complete-profile");
        return;
      }
      return;
    }
  }, [user, isComplete, loading, authLoading, pathname, router]);

  const refetch = async () => {
    hasChecked.current = false;
    lastCheckedUserId.current = null;
    checkAttempts.current = 0;
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
