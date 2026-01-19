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

// Shape of profile context exposed to consumers
interface ProfileContextType {
  loading: boolean;
  isComplete: boolean | null;
  missingFields: string[];
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Auth-related pages that should not be accessible
// once the user profile is complete
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

  /**
   * loading        → profile checking state
   * isComplete     → profile completion status
   * missingFields  → list of required fields that are missing
   */
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Prevent redundant profile checks for the same user
  const hasChecked = useRef(false);
  const lastCheckedUserId = useRef<string | null>(null);

  // Fetch profile completeness status from backend
  const checkProfile = useCallback(async () => {
    // Reset state when user is not authenticated
    if (!user) {
      setLoading(false);
      setIsComplete(null);
      hasChecked.current = false;
      lastCheckedUserId.current = null;
      return;
    }

    // Support multiple possible user id keys
    const userId = user.id || user.user_id || user.uid || user.userId;
    if (!userId) {
      setLoading(false);
      return;
    }

    // Avoid re-checking if already validated for the same user
    if (hasChecked.current && lastCheckedUserId.current === userId) {
      return;
    }

    // Admin always complete
    // (This logic is intentionally disabled to enforce completion for all roles)
    // if (user.role_id === "role2" || user.role_id === "role3") {
    //   setIsComplete(true);
    //   setMissingFields([]);
    //   setLoading(false);
    //   hasChecked.current = true;
    //   lastCheckedUserId.current = userId;
    //   return;
    // }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setIsComplete(false);
        return;
      }

      // Request profile completeness data from API
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch profile");

      const json = await res.json();
      const data = json?.data || {};

      // Normalize isComplete value (boolean / numeric)
      setIsComplete(data.isComplete === true || data.isComplete === 1);
      setMissingFields(
        Array.isArray(data.missingFields) ? data.missingFields : []
      );

      hasChecked.current = true;
      lastCheckedUserId.current = userId;
    } catch {
      // Fail-safe: treat profile as incomplete
      setIsComplete(false);
      setMissingFields([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Trigger profile check once auth state is ready
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      setIsComplete(null);
      hasChecked.current = false;
      lastCheckedUserId.current = null;
      return;
    }

    checkProfile();
  }, [authLoading, user, checkProfile]);

  // Handle navigation based on profile completeness
  useEffect(() => {
    // Wait until both auth & profile loading are finished
    if (authLoading || loading) {
      return;
    }

    if (!user) {
      return;
    }

    // Still resolving profile status
    if (isComplete === null) {
      return;
    }

    const isOnAuthPage = AUTH_PAGES.includes(pathname);
    const isOnCompleteProfilePage = pathname === "/complete-profile";

    // 1. Profile is COMPLETE
    if (isComplete === true) {
      // Prevent access to auth & complete-profile pages
      if (isOnAuthPage || isOnCompleteProfilePage) {
        router.replace("/home");
        return;
      }
      return;
    }

    // 2. Profile is INCOMPLETE
    if (isComplete === false) {
      // Redirect from auth pages directly to complete-profile
      if (isOnAuthPage) {
        router.replace("/complete-profile");
        return;
      }

      // Force user to stay on complete-profile page
      if (!isOnCompleteProfilePage) {
        router.replace("/complete-profile");
        return;
      }
      return;
    }
  }, [user, isComplete, loading, authLoading, pathname, router]);

  // Manually re-check profile (used after profile update)
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

// Hook to consume profile context safely
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
}
