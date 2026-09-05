import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useAllocations } from "@/lib/ballast";

export const Route = createFileRoute("/_authenticated/dashboard/allocations")({
  component: Allocations,
});

function Allocations() {
  const { data: allocations = [] } = useAllocations();
  const chartData = allocations.map((a) => ({
    name: a.asset_class,
    target: Number(a.target_weight),
    current: Number(a.current_weight),
  }));

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold">Target vs current weights</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="target" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass overflow-x-auto rounded-2xl p-5">
        <h2 className="text-sm font-semibold">Rebalance history</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2">Asset class</th>
              <th className="py-2">Target</th>
              <th className="py-2">Current</th>
              <th className="py-2">Drift</th>
              <th className="py-2">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a) => {
              const drift = Number(a.current_weight) - Number(a.target_weight);
              return (
                <tr key={a.id} className="border-t border-border">
                  <td className="py-3">{a.asset_class}</td>
                  <td className="num py-3">{Number(a.target_weight).toFixed(1)}%</td>
                  <td className="num py-3">{Number(a.current_weight).toFixed(1)}%</td>
                  <td
                    className={`num py-3 ${
                      Math.abs(drift) > 2
                        ? "text-destructive"
                        : Math.abs(drift) > 1
                          ? "text-warning"
                          : "text-primary"
                    }`}
                  >
                    {drift > 0 ? "+" : ""}
                    {drift.toFixed(1)}%
                  </td>
                  <td className="num py-3 text-muted-foreground">
                    {new Date(a.updated_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
