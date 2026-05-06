import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminUsersPage() {
  return (
    <DashboardShell title="Admin · Users">
      <p className="text-muted-foreground">User moderation, verification checks, role assignment, and recovery tools.</p>
    </DashboardShell>
  );
}
