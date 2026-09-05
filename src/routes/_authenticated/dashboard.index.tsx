import { createFileRoute } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { RadialGauge } from "@/components/BallastMarks";
import { useAlerts, useAllocations, usePortfolio, money, severityTone } from "@/lib/ballast";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
});

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Overview() {
  const { data: portfolio } = usePortfolio();
  const { data: allocations = [] } = useAllocations();
  const { data: alerts = [] } = useAlerts();

  const drift = allocations.reduce(
    (acc, a) => acc + Math.abs(Number(a.current_weight) - Number(a.target_weight)),
    0,
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Portfolio value
          </div>
          <div className="num mt-2 text-3xl font-semibold">
            {money(Number(portfolio?.total_value ?? 0))}
          </div>
          <div className="mt-1 text-xs text-primary">{portfolio?.name ?? "—"}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Total drift</div>
          <div className="num mt-2 text-3xl font-semibold">{drift.toFixed(1)}%</div>
          <div className="mt-1 text-xs text-muted-foreground">Sum of absolute deviations</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Open breaches</div>
          <div className="num mt-2 text-3xl font-semibold text-destructive">
            {alerts.filter((a) => a.severity === "breach").length}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Auto-handled by the engine</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Current allocation</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations.map((a) => ({
                    name: a.asset_class,
                    value: Number(a.current_weight),
                  }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={3}
                  stroke="none"
                >
                  {allocations.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                  formatter={(v: number) => `${v}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {allocations.map((a, i) => (
              <span key={a.id} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                {a.asset_class} <span className="num">{Number(a.current_weight).toFixed(1)}%</span>
              </span>
            ))}
          </div>
        </div>

        <div className="glass flex flex-col items-center rounded-2xl p-5">
          <h2 className="self-start text-sm font-semibold">Risk exposure</h2>
          <RadialGauge value={Number(portfolio?.risk_score ?? 0)} label="risk index" />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold">Recent automated actions</h2>
        <ul className="mt-4 space-y-3">
          {alerts.slice(0, 5).map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground">
                  {a.action_taken ?? "No action required"}
                </div>
              </div>
              <span
                className={`num shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${severityTone(a.severity)}`}
              >
                {new Date(a.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {alerts.length === 0 && (
            <li className="text-sm text-muted-foreground">No activity yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
