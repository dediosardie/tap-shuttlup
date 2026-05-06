import { Download, Eye } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { AnalyticsChart } from "@/app/components/dashboard/AnalyticsChart";

const monthStats = [
  { label: "Total Taps", value: "4,289", sub: "This month" },
  { label: "Unique Visitors", value: "2,917", sub: "This month" },
  { label: "Avg. Daily Taps", value: "138", sub: "7-day avg" },
  { label: "Conversion Rate", value: "12.3%", sub: "Tap → Save" },
];

const geoData = [
  { city: "Manila", country: "PH", taps: 1140, pct: 26.6 },
  { city: "Quezon City", country: "PH", taps: 924, pct: 21.5 },
  { city: "Makati", country: "PH", taps: 711, pct: 16.6 },
  { city: "Pasig", country: "PH", taps: 488, pct: 11.4 },
  { city: "Taguig", country: "PH", taps: 369, pct: 8.6 },
];

export function DashboardAnalyticsPage() {
  return (
    <DashboardShell title="Analytics">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {monthStats.map(({ label, value, sub }) => (
          <div key={label} className="floating-card rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="mt-0.5 text-xs text-[var(--text-disabled)]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <AnalyticsChart />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--accent-color)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Geographic Breakdown</h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[var(--border-muted)] px-4 py-2.5 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            <span>City</span><span>Taps</span><span>Share</span>
          </div>
          {geoData.map((row) => (
            <div
              key={row.city}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[var(--border-muted)] px-4 py-3 text-sm last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--accent-color)]">
                  {row.country}
                </div>
                <span className="text-[var(--text-primary)]">{row.city}</span>
              </div>
              <span className="font-medium text-[var(--text-primary)]">{row.taps.toLocaleString()}</span>
              <div className="flex w-20 items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-color)]"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-[var(--text-muted)]">{row.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
