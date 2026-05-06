import { DashboardShell } from "../../components/dashboard/dashboard-shell";
import { AnalyticsChart } from "../../components/dashboard/analytics-chart";
import { BarChart3, CreditCard, Eye, TrendingUp, Wifi } from "lucide-react";

const stats = [
  { label: "Total Taps", value: "18,290", delta: "+12.4%", icon: Wifi, color: "text-[var(--accent-color)]" },
  { label: "Profile Views", value: "13,417", delta: "+8.1%", icon: Eye, color: "text-blue-400" },
  { label: "Saves", value: "4,908", delta: "+5.6%", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Active Cards", value: "26", delta: "+2", icon: CreditCard, color: "text-violet-400" },
];

const recentActivity = [
  { action: "NFC Tap", from: "Manila, PH", device: "Mobile · iOS", time: "2 min ago" },
  { action: "QR Scan", from: "Quezon City, PH", device: "Mobile · Android", time: "14 min ago" },
  { action: "Profile Save", from: "Makati, PH", device: "Desktop · Chrome", time: "31 min ago" },
  { action: "NFC Tap", from: "Pasig, PH", device: "Mobile · iOS", time: "1 hr ago" },
  { action: "Profile View", from: "Taguig, PH", device: "Mobile · Safari", time: "2 hr ago" },
];

export default function DashboardPage() {
  return (
    <DashboardShell title="Overview">
      {/* Stats grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, delta, icon: Icon, color }) => (
          <div
            key={label}
            className="floating-card rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="mt-1 text-xs text-emerald-400">{delta} this week</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6">
        <AnalyticsChart />
      </div>

      {/* Recent activity */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[var(--accent-color)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h2>
        </div>
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] overflow-hidden">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i < recentActivity.length - 1 ? "border-b border-[var(--border-muted)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                  <Wifi className="h-3.5 w-3.5 text-[var(--accent-color)]" />
                </span>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{item.action}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.from} · {item.device}</p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-disabled)]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

