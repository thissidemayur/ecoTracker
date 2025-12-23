// @/components/user/user-account-menu.tsx
"use client";

import { useState } from "react";
import {
  Settings,
  LogOut,
  ChevronDown,
  UserCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// STORES & HOOKS
import { useAuthStore } from "@/state/authStore";
import { useAuthApi } from "@/hooks/useAuthApi";

// COMPONENTS
import { UpdateProfileForm } from "./user-updateProfile";
import { ChangePasswordForm } from "./user-changePassword";
import { ViewProfileContent } from "@/components/dashboard/user-profile";

export function UserAccountMenu() {
  const { user } = useAuthStore();
  const { logout } = useAuthApi();

  // Three separate states for three separate windows
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex items-center gap-3 px-2 h-12 hover:bg-zinc-900/50 rounded-xl transition-all border border-zinc-800/50"
          >
            <Avatar className="w-8 h-8 rounded-lg">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-zinc-950 text-emerald-500 font-bold text-xs">
                {getInitials(user?.name || "NA")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-none">
              <span className="text-xs font-bold text-zinc-200">
                {user.name?.split(" ")[0]}
              </span>
              <span className="text-[9px] text-zinc-500 uppercase font-bold">
                Online
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 bg-zinc-950 border-zinc-900 rounded-[1.5rem] p-2 text-white/70"
        >
          {/* 1. Header Row */}
          <div className="p-4 mb-2 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 flex items-center gap-3 text-white">
            <Avatar className="w-10 h-10 rounded-xl">
              <AvatarFallback className="text-emerald-500 font-bold text-sm bg-emerald-500/10">
                {getInitials(user?.name || "NA")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.name || "NA"}
              </p>
              <Badge className="bg-emerald-500/10 text-emerald-500 text-[8px] mt-1">
                {user.role}
              </Badge>
            </div>
          </div>

          {/* 2. Menu Rows */}
          <DropdownMenuItem
            onClick={() => setShowViewProfile(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
          >
            <UserCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">
              My Profile
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowUpdateProfile(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
          >
            <Settings className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Update Info
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Change Password
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-zinc-900 mx-2" />

          <DropdownMenuItem
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Sign Out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- DIALOGS --- */}

      {/* 1. VIEW PROFILE DIALOG */}
      <Dialog open={showViewProfile} onOpenChange={setShowViewProfile}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-900 rounded-[2rem] p-8">
          <ViewProfileContent user={user} />
        </DialogContent>
      </Dialog>

      {/* 2. UPDATE INFO DIALOG */}
      <Dialog open={showUpdateProfile} onOpenChange={setShowUpdateProfile}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 border-zinc-900 rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-zinc-900">
            <DialogTitle className="text-xl font-bold text-white uppercase italic">
              Update Personal Info
            </DialogTitle>
          </DialogHeader>
          <div className="p-8">
            <UpdateProfileForm onSuccess={() => setShowUpdateProfile(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. CHANGE PASSWORD DIALOG */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-900 rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-zinc-900">
            <DialogTitle className="text-xl font-bold text-red-500 uppercase italic">
              Security Update
            </DialogTitle>
          </DialogHeader>
          <div className="p-8">
            <ChangePasswordForm
              onSuccess={() => setShowChangePassword(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
