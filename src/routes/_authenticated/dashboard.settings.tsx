import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolio, useProfile } from "@/lib/ballast";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile } = useProfile();
  const { data: portfolio } = usePortfolio();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.fullName) setName(profile.fullName);
  }, [profile?.fullName]);
  useEffect(() => {
    if (portfolio?.name) setPortfolioName(portfolio.name);
  }, [portfolio?.name]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (uid) {
      await supabase.from("profiles").update({ full_name: name }).eq("id", uid);
    }
    if (portfolio) {
      await supabase.from("portfolios").update({ name: portfolioName }).eq("id", portfolio.id);
    }
    await queryClient.invalidateQueries();
    setSaving(false);
    toast.success("Settings saved.");
  };

  return (
    <form onSubmit={save} className="glass max-w-lg rounded-2xl p-5">
      <h2 className="text-sm font-semibold">Settings</h2>
      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile?.email ?? ""} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio name</Label>
          <Input
            id="portfolio"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
          />
        </div>
        <Button type="submit" className="glow-hover" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
