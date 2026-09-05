import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { money, usePortfolio, useAllocations } from "@/lib/ballast";

export const Route = createFileRoute("/_authenticated/dashboard/simulator")({
  component: Simulator,
});

type Impact = {
  assetClass: string;
  shock: number;
  newValue: number;
  lossValue: number;
  rows: { name: string; before: number; after: number }[];
  controls: string[];
};

function Simulator() {
  const { data: portfolio } = usePortfolio();
  const { data: allocations = [] } = useAllocations();
  const queryClient = useQueryClient();
  const [assetClass, setAssetClass] = useState("Equities");
  const [shock, setShock] = useState(-15);
  const [result, setResult] = useState<Impact | null>(null);
  const [saving, setSaving] = useState(false);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (allocations.length === 0) return;
    const total = Number(portfolio?.total_value ?? 0);
    const shocked = allocations.map((a) => {
      const w = Number(a.current_weight);
      const factor = a.asset_class === assetClass ? 1 + shock / 100 : 1;
      return { name: a.asset_class, before: w, raw: w * factor };
    });
    const rawSum = shocked.reduce((s, r) => s + r.raw, 0);
    const rows = shocked.map((r) => ({
      name: r.name,
      before: r.before,
      after: (r.raw / rawSum) * 100,
    }));
    const newValue = total * (rawSum / 100);

    const controls: string[] = [];
    rows.forEach((r) => {
      const target = Number(
        allocations.find((a) => a.asset_class === r.name)?.target_weight ?? r.after,
      );
      const drift = r.after - target;
      if (Math.abs(drift) > 2)
        controls.push(
          `${r.name}: drift ${drift > 0 ? "+" : ""}${drift.toFixed(1)}% → automatic rebalance triggered`,
        );
      else if (Math.abs(drift) > 1)
        controls.push(`${r.name}: drift ${drift.toFixed(1)}% → watchlist warning`);
    });
    if (controls.length === 0) controls.push("All constraints satisfied — no action required.");

    const impact: Impact = {
      assetClass,
      shock,
      newValue,
      lossValue: newValue - total,
      rows,
      controls,
    };
    setResult(impact);

    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user && portfolio) {
      await supabase.from("scenarios").insert({
        user_id: userData.user.id,
        portfolio_id: portfolio.id,
        name: `${assetClass} ${shock}%`,
        shock_asset_class: assetClass,
        shock_pct: shock,
        result: impact as unknown as Record<string, unknown>,
      });
      await queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    }
    setSaving(false);
    toast.success("Scenario simulated and saved.");
  };

  return (
    <div className="space-y-5">
      <form onSubmit={run} className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold">Scenario simulator</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Apply a hypothetical market shock and see the simulated allocation impact.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset class</Label>
            <select
              id="asset"
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-secondary px-3 text-sm"
            >
              {allocations.map((a) => (
                <option key={a.id} value={a.asset_class}>
                  {a.asset_class}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shock">Shock (%)</Label>
            <Input
              id="shock"
              type="number"
              value={shock}
              onChange={(e) => setShock(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="glow-hover w-full" disabled={saving}>
              Run simulation
            </Button>
          </div>
        </div>
      </form>

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold">Simulated allocation</h3>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2">Asset class</th>
                  <th className="py-2">Before</th>
                  <th className="py-2">After</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.name} className="border-t border-border">
                    <td className="py-2">{r.name}</td>
                    <td className="num py-2">{r.before.toFixed(1)}%</td>
                    <td className="num py-2 text-primary">{r.after.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="num mt-4 text-sm">
              Portfolio value: {money(result.newValue)}{" "}
              <span className="text-destructive">({money(result.lossValue)})</span>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold">Triggered controls</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {result.controls.map((c) => (
                <li key={c} className="rounded-lg border border-border px-3 py-2">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
