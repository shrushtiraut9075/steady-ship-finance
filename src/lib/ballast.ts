import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type Portfolio = {
  id: string;
  name: string;
  total_value: number;
  risk_score: number;
};

export type Allocation = {
  id: string;
  asset_class: string;
  target_weight: number;
  current_weight: number;
  updated_at: string;
};

export type RiskAlert = {
  id: string;
  severity: string;
  title: string;
  message: string | null;
  action_taken: string | null;
  created_at: string;
};

export const severityTone = (s: string) =>
  s === "breach"
    ? "text-destructive border-destructive/40 bg-destructive/10"
    : s === "warning"
      ? "text-warning border-warning/40 bg-warning/10"
      : "text-primary border-primary/40 bg-primary/10";

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async (): Promise<Portfolio | null> => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("id,name,total_value,risk_score")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Portfolio | null;
    },
  });
}

export function useAllocations() {
  return useQuery({
    queryKey: ["allocations"],
    queryFn: async (): Promise<Allocation[]> => {
      const { data, error } = await supabase
        .from("allocations")
        .select("id,asset_class,target_weight,current_weight,updated_at")
        .order("current_weight", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Allocation[];
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["risk_alerts"],
    queryFn: async (): Promise<RiskAlert[]> => {
      const { data, error } = await supabase
        .from("risk_alerts")
        .select("id,severity,title,message,action_taken,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RiskAlert[];
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("full_name,avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      return {
        email: user.email ?? "",
        fullName: (data?.full_name as string | null) ?? user.email?.split("@")[0] ?? "Analyst",
        avatarUrl: (data?.avatar_url as string | null) ?? null,
      };
    },
  });
}
