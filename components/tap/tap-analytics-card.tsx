import { TrendingUp } from "lucide-react";

interface TapAnalyticsCardProps {
  label: string;
  value: number | string;
  delta?: string;
  icon: React.ElementType;
  iconColor?: string;
}

export function TapAnalyticsCard({
  label,
  value,
  delta,
  icon: Icon,
  iconColor = "text-[var(--accent-color)]",
}: TapAnalyticsCardProps) {
  return (
    <div className="floating-card rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {delta && (
        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          {delta}
        </p>
      )}
    </div>
  );
}
