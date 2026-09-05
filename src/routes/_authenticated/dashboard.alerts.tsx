import { createFileRoute } from "@tanstack/react-router";

import { useAlerts, severityTone } from "@/lib/ballast";

export const Route = createFileRoute("/_authenticated/dashboard/alerts")({
  component: Alerts,
});

function Alerts() {
  const { data: alerts = [], isLoading } = useAlerts();

  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-sm font-semibold">Risk alerts</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Threshold breaches, warnings and the action the engine took.
      </p>

      <ul className="mt-5 space-y-3">
        {isLoading && <li className="text-sm text-muted-foreground">Loading…</li>}
        {!isLoading && alerts.length === 0 && (
          <li className="text-sm text-muted-foreground">No alerts recorded.</li>
        )}
        {alerts.map((a) => (
          <li key={a.id} className={`rounded-xl border p-4 ${severityTone(a.severity)}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-foreground">{a.title}</span>
              <span className="num text-[11px] uppercase tracking-wide">
                {a.severity} · {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.message}</p>
            {a.action_taken && (
              <p className="mt-2 text-xs text-foreground/80">Action: {a.action_taken}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
