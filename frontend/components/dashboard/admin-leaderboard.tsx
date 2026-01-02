"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, User, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  userId: string;
  name: string;
  total_co2e: number;
  rank: number;
}

interface LeaderboardProps {
  highPerformers: LeaderboardEntry[];
  lowPerformers: LeaderboardEntry[];
}

export function AdminLeaderboard({
  highPerformers,
  lowPerformers,
}: LeaderboardProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* 1. Sustainability Leaders (Low Footprint) */}
      <Card className="bg-zinc-900/30 border-zinc-900 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-6 border-b border-zinc-900 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-white flex items-center gap-2 font-black italic tracking-tighter uppercase text-lg">
                <TrendingDown className="size-4 text-emerald-500" />
                Sustainability_Leaders
              </CardTitle>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest italic">
                {"//"} Lowest_Recorded_Impact_Nodes
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-[9px] uppercase">
              Top_10
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-900">
            {lowPerformers?.map((node, index) => (
              <LeaderboardRow
                key={node.userId}
                node={node}
                index={index}
                type="low"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Critical Impact Nodes (High Footprint) */}
      <Card className="bg-zinc-900/30 border-zinc-900 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-6 border-b border-zinc-900 bg-red-500/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-white flex items-center gap-2 font-black italic tracking-tighter uppercase text-lg">
                <TrendingUp className="size-4 text-red-500" />
                Critical_Impact_Nodes
              </CardTitle>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest italic">
                {"//"} Highest_Recorded_Impact_Nodes
              </p>
            </div>
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-mono text-[9px] uppercase">
              Alert_Scope
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-900">
            {highPerformers?.map((node, index) => (
              <LeaderboardRow
                key={node.userId}
                node={node}
                index={index}
                type="high"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardRow({
  node,
  index,
  type,
}: {
  node: LeaderboardEntry;
  index: number;
  type: "low" | "high";
}) {
  return (
    <div className="group flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-all cursor-crosshair">
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "text-[10px] font-mono font-black w-4",
            type === "low" ? "text-emerald-500/50" : "text-red-500/50"
          )}
        >
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <div className="size-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
          <User className="size-3.5 text-zinc-600" />
        </div>
        <div>
          <p className="text-xs font-black text-zinc-200 uppercase italic tracking-tighter">
            {node.name}
          </p>
          <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
            UID: {node.userId.slice(-8)}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "text-sm font-black italic tracking-tighter",
            type === "low" ? "text-emerald-500" : "text-red-500"
          )}
        >
          {node.total_co2e.toLocaleString()}{" "}
          <span className="text-[8px] not-italic text-zinc-600 font-mono">
            KG
          </span>
        </p>
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[7px] font-mono text-zinc-500 uppercase">
            View_Details
          </span>
          <ArrowRight className="size-2 text-zinc-500" />
        </div>
      </div>
    </div>
  );
}
