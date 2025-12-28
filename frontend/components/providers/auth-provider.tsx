"use client";

import { useAuthApi } from "@/hooks/useAuthApi";
import { useUserApi } from "@/hooks/useUserApi";
import { useAuthStore } from "@/state/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setLoading, isLoading, isAuthenticated, user } = useAuthStore();
  const { rotateRefreshToken } = useAuthApi();
  const { fetchMe } = useUserApi();
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (initialized.current) return;
      initialized.current = true;

      // If already authenticated in this session, just stop loading
      if (isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // This is where the SMTP/Server error might be hanging the request
        await rotateRefreshToken();
        await fetchMe();
      } catch (error) {
        console.error("Session recovery failed:", error);
      } finally {
        // FORCE loading to false so the UI can at least render
        setLoading(false);
      }
    };

    initializeApp();
  }, [isAuthenticated, rotateRefreshToken, fetchMe, setLoading]);

  useEffect(() => {
    // 1. Don't redirect while we are still checking the session
    if (isLoading) return;

    // 2. Define Public Routes (Where users CAN go without being logged in)
    const isPublicPath =
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/verify-email");

    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950">
        <div className="relative size-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        </div>
        <div className="mt-4 animate-pulse font-black text-emerald-500 uppercase tracking-widest text-xs italic">
          Synchronizing Session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
