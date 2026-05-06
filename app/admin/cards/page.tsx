import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminCardsPage() {
  return (
    <DashboardShell title="Admin · Cards">
      <p className="text-muted-foreground">Manage issued NFC cards, activation state, and anti-clone integrity.</p>
    </DashboardShell>
  );
}
