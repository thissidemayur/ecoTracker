"use client";
import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/state/authStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // 1. Define Public Routes
  const isPublicPath =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/verify-email");

  // 2. Handle Authentication Redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isPublicPath, router]);

  // 3. FULL-PAGE UNAUTHORIZED VIEW
  // If user is logged in but trying to access admin without admin role
  if (
    !isLoading &&
    isAuthenticated &&
    pathname.startsWith("/admin") &&
    user?.role !== "ADMIN"
  ) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-6">
          <ShieldAlert className="size-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
          Access <span className="text-red-500">Denied</span>
        </h1>
        <p className="text-zinc-500 max-w-sm mb-8 font-medium italic">
          Your credentials do not have the required clearance for Platform
          Governance. This attempt has been logged.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-zinc-100 text-zinc-950 hover:bg-white font-bold uppercase tracking-widest px-8 h-12 rounded-2xl"
        >
          Return to Base
        </Button>
      </div>
    );
  }

  // ... rest of your existing AuthProvider logic (Loading states, etc.)
  return <>{children}</>;
};
