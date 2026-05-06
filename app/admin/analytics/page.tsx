import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminAnalyticsPage() {
  return (
    <DashboardShell title="Admin · Analytics">
      <p className="text-muted-foreground">Platform-wide taps, geographies, devices, and anomalies dashboard.</p>
    </DashboardShell>
  );
}
