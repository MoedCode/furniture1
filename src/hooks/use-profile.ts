"use client";

import { fetchWithAuth } from "@/api/hooks/api";
import {
  type ProfileData,
  profileSchema,
  type UserData,
  userSchema,
} from "@/schemas/user";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function useProfileData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("profile");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check authentication
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        router.replace("/");
      }

      // Fetch user data
      const userResponse = await fetchWithAuth("/users", userSchema, {
        init: { method: "GET" },
      });
      setUserData(userResponse);

      // Fetch profile data
      const profileResponse = await fetchWithAuth("/profile", profileSchema, {
        init: { method: "GET" },
      });
      setProfileData(profileResponse);
    } catch (err) {
      console.error("Profile fetch error:", err);
      let errorMessage = t("error.failedToFetch");

      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (
          message.includes("not authenticated") ||
          message.includes("can't use fetchWithAuth")
        ) {
          errorMessage = t("error.notAuthenticated");
        } else if (
          message.includes("failed to fetch") ||
          message.includes("network")
        ) {
          errorMessage = t("error.networkError");
        } else if (
          message.includes("server error") ||
          message.includes("http error")
        ) {
          errorMessage = t("error.serverError");
        } else {
          // For any other error, show the actual error message for debugging
          errorMessage = `${t("error.failedToFetch")}: ${err.message}`;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [t, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    userData,
    profileData,
    isLoading,
    error,
    refetch: fetchData,
  };
}
