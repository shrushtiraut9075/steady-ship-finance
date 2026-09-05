import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, FlaskConical, LayoutGrid, LogOut, PieChart, Settings } from "lucide-react";

import { BallastLogo } from "@/components/BallastMarks";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/ballast";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ballast" },
      {
        name: "description",
        content: "Monitor exposure, risk alerts and automated rebalancing decisions in Ballast.",
      },
      { property: "og:title", content: "Dashboard — Ballast" },
      {
        property: "og:description",
        content: "Monitor exposure, risk alerts and automated rebalancing decisions in Ballast.",
      },
    ],
  }),
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/dashboard/allocations", label: "Allocations", icon: PieChart, exact: false },
  { to: "/dashboard/alerts", label: "Risk Alerts", icon: AlertTriangle, exact: false },
  { to: "/dashboard/simulator", label: "Scenario Simulator", icon: FlaskConical, exact: false },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/signin", replace: true });
  };

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl gap-5 px-4 py-5">
        <aside
          className={`glass sticky top-5 hidden h-[calc(100vh-2.5rem)] shrink-0 rounded-2xl p-4 transition-all md:block ${
            collapsed ? "w-[76px]" : "w-60"
          }`}
        >
          <div className="flex items-center justify-between">
            {!collapsed && <BallastLogo />}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-md p-2 text-muted-foreground hover:text-primary"
              aria-label="Toggle sidebar"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <nav className="mt-6 space-y-1">
            {nav.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                activeProps={{ className: "bg-primary/12 text-primary" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="glass mb-5 flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="md:hidden">
              <BallastLogo />
            </div>
            <div className="hidden text-sm text-muted-foreground md:block">
              Capital control desk
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {(profile?.fullName ?? "A").slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden text-sm sm:block">
                  <div className="leading-tight">{profile?.fullName ?? "Analyst"}</div>
                  <div className="text-xs text-muted-foreground">{profile?.email}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </div>
          </div>

          <nav className="glass mb-5 flex gap-1 overflow-x-auto rounded-xl p-1 md:hidden">
            {nav.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                activeProps={{ className: "bg-primary/15 text-primary" }}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-muted-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
