"use client";

import { useEffect, useState } from "react";
import { DashboardWrapper } from "@/components/providers/DashboardProvider";
import { GlobalSummaryGrid } from "@/components/dashboard/global-summary-grid";
import { AdminLeaderboard } from "@/components/dashboard/admin-leaderboard";
import { UserValidationTable } from "@/components/dashboard/user-validation-table";
import { Activity, RefreshCcw, ShieldAlert, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/state/adminStore";

export default function AdminDashboard() {
  const { summary, isLoading } = useAdminStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { fetchAdminSummary } = useAdminApi();

  useEffect(() => {
    fetchAdminSummary();
  }, [fetchAdminSummary]);

  // 2. Refresh Handler: This runs when you click "Sync Database"
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAdminSummary(); // Get the latest data
    setIsRefreshing(false);
    toast.success("Database synchronized", {
      description: "Admin registry updated with latest node telemetry.",
    });
  };

  if (isLoading || !summary) {
    return (
      <DashboardWrapper className="flex flex-col items-center justify-center min-h-[60vh]">
        <Activity className="size-8 text-red-500 animate-spin mb-4" />
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">
          Establishing_Secure_Admin_Tunnel...
        </p>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-3 text-red-500" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-black italic">
                Platform_Governance_v4.0
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              Global{" "}
              <span className="text-red-500 text-shadow-glow">Audit</span>
            </h1>
            <p className="text-zinc-500 font-medium italic text-sm leading-none">
              Platform-wide oversight and node validation registry.
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase h-12 px-6 rounded-2xl hover:bg-zinc-900 transition-all"
          >
            <RefreshCcw
              className={cn("mr-2 size-3", isRefreshing && "animate-spin")}
            />
            Sync_Database
          </Button>
        </header>

        {/* 1. GLOBAL SUMMARY (KPI Grid) */}
        <GlobalSummaryGrid summaryData={summary} />

        {/* 2. LEADERBOARD (High vs Low Nodes) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Terminal className="size-4 text-zinc-700" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              System_Performance_Ranking
            </h2>
          </div>
          <AdminLeaderboard
            highPerformers={summary.topPerformers}
            lowPerformers={summary.bottomPerformers}
          />
        </div>

        {/* 3. VERIFICATION QUEUE (Table) */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-zinc-700" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Node_Validation_Registry
            </h2>
          </div>
          {/* <UserValidationTable users={summary.pendingUsers} /> */}
        </div>
      </div>
    </DashboardWrapper>
  );
}
