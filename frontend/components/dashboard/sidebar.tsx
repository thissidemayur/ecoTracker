  "use client";

  import * as React from "react";
  import {
    Calculator,
    History,
    Shield,
    Leaf,
    LayoutDashboard,
    LogOut,
    Search,
    PlusCircle,
  } from "lucide-react";
  import { usePathname } from "next/navigation";
  import Link from "next/link";
  import { cn } from "@/lib/utils";

  // AUTH STORE IMPORT
  import { useAuthStore } from "@/state/authStore";

  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
  } from "@/components/ui/sidebar";
  import { Badge } from "@/components/ui/badge";
  import { useAuthApi } from "@/hooks/useAuthApi";

  export function AppSidebar() {
    const pathname = usePathname();
    const { user, isLoading } = useAuthStore(); // Get user role and logout action
    const { logout } = useAuthApi();
    console.log("User: ", user);

    const [isMounted, setIsMounted] = React.useState(false);
    // SET TO TRUE ON MOUNT
    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    const logoutHandler = async (e: React.MouseEvent) => {
      // 1. Prevent the click from "bubbling up" to the parent div
      e.preventDefault();
      e.stopPropagation();

      console.log("Logout initiated...");
      try {
        await logout();
        console.log("User logged out successfully");
        // Force a reload to the login page to clear all states
        window.location.href = "/";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    // 1. SIMPLE NAVIGATION GROUPS
    const navItems = [
      {
        group: "Main Menu",
        items: [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
          {
            icon: Calculator,
            label: "Calculator",
            href: "/dashboard/calculate",
          },
          { icon: History, label: "My History", href: "/dashboard/history" },
        ],
      },
    ];
        const isAdmin = user?.role?.toLowerCase() === "admin";
    const isUserLoading = !isMounted || isLoading || !user; // Update this line
    console.log("Current User Role:", user?.role);
   const adminItems = {
     group: "System Administration", // More professional group name
     items: [
       {
         icon: Shield,
         label: "Admin Dashboard", // Changed from Command Center
         href: "/dashboard/admin",
         badge: "Private",
       },
       {
         icon: LayoutDashboard, // Use a list/grid icon for management
         label: "Manage Factors", // Changed from Data Master
         href: "/dashboard/admin/factors",
         badge:"Data"
       },
       {
         icon: PlusCircle, // Import PlusCircle from lucide-react for 'Create'
         label: "Add New Factor", // Clear action-oriented label
         href: "/dashboard/admin/factors/create",
         badge: "Add",
       },
     ],
   };

    const getInitials = (name: string) => {
      if (!name) return "??";
      return name
        ?.split(" ")
        ?.map((n) => n[0])
        ?.join("")
        ?.toUpperCase()
        ?.slice(0, 2);
    };

    return (
      <Sidebar
        collapsible="icon"
        className="border-r border-zinc-900 bg-zinc-950 text-zinc-400"
      >
        {/* BRAND HEADER */}
        <SidebarHeader className="h-20 border-b border-zinc-900/50 px-6 flex flex-row items-center bg-zinc-950">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-emerald-500/20 blur-md rounded-lg group-hover:bg-emerald-500/40 transition-all" />
              <div className="relative flex aspect-square size-9 items-center justify-center rounded-xl bg-zinc-900 border border-emerald-500/30 text-emerald-500 shrink-0">
                <Leaf className="size-5" />
              </div>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-black text-white text-base tracking-tighter italic uppercase">
                EcoTrack
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  System Active
                </span>
              </div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-4 pt-6 space-y-8 bg-zinc-950 overflow-y-auto no-scrollbar">
          {/* QUICK SEARCH */}
          <div className="group-data-[collapsible=icon]:hidden px-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-zinc-500">
              <Search className="size-4" />
              <span className="text-xs font-bold">Search...</span>
            </button>
          </div>

          {/* STANDARD GROUPS */}
          {navItems.map((group) => (
            <SidebarGroup key={group.group} className="p-0">
              <SidebarGroupLabel className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 group-data-[collapsible=icon]:hidden">
                {group.group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "h-11 px-4 rounded-xl transition-all",
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                          )}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 w-full"
                          >
                            <item.icon
                              className={cn(
                                "size-4.5",
                                isActive && "text-emerald-500"
                              )}
                            />
                            <span className="text-sm font-bold tracking-tight">
                              {item.label}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {/* 🛡️ ADMIN GROUP: Hidden during sync,isAdmin then shows only for ADMIN role */}
          {isMounted &&  !isUserLoading && isAdmin && (
            <SidebarGroup className="p-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <SidebarGroupLabel className="px-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 group-data-[collapsible=icon]:hidden">
                Admin Control
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5 hover:text-black">
                  {adminItems.items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        className="h-11 px-4 rounded-xl border border-transparent hover:text-black hover:border-emerald-500/30 text-zinc-500 "
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="size-4.5" />
                          <span className="text-sm font-bold tracking-tight">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="ml-auto text-[9px] bg-emerald-500 text-black">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* FOOTER: USER STATUS */}
        <SidebarFooter className="p-4 mt-auto border-t border-zinc-900/50 bg-zinc-950">
          {isUserLoading ? (
            // --- SKELETON STATE (While Refreshing) ---
            <div className="flex items-center gap-3 p-2 animate-pulse">
              <div className="size-9 rounded-xl bg-zinc-900 border border-zinc-800" />
              <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
                <div className="h-3 w-24 bg-zinc-900 rounded" />
                <div className="h-2 w-16 bg-zinc-900 rounded" />
              </div>
            </div>
          ) : (
            // --- LOADED STATE ---
            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-900 transition-all group cursor-pointer border border-transparent hover:border-zinc-800">
              <div className="relative shrink-0">
                <div className="size-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-emerald-500/50">
                  <span className="text-xs font-bold text-emerald-500">
                    {getInitials(user?.name || "")}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">
                  {user?.name}
                </span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  {user?.role} Account
                </span>
              </div>
              <button
                onClick={logoutHandler}
                className="ml-auto p-1.5 hover:bg-red-500/10 rounded-lg group-data-[collapsible=icon]:hidden"
              >
                <LogOut className="size-4 text-zinc-700 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    );
  }
