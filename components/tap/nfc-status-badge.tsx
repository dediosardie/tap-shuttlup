import { Wifi, WifiOff } from "lucide-react";

interface NFCStatusBadgeProps {
  active: boolean;
  tapCount?: number;
  size?: "sm" | "md";
}

export function NFCStatusBadge({ active, tapCount, size = "md" }: NFCStatusBadgeProps) {
  const base = size === "sm" ? "px-2 py-0.5 text-[10px] gap-1" : "px-3 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium uppercase tracking-wider ${base} ${
        active
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-[var(--bg-elevated)] text-[var(--text-disabled)]"
      }`}
    >
      {active ? <Wifi className="h-3 w-3 shrink-0" /> : <WifiOff className="h-3 w-3 shrink-0" />}
      {active ? "Active" : "Inactive"}
      {tapCount !== undefined && (
        <span className="ml-1 opacity-70">· {tapCount.toLocaleString()} taps</span>
      )}
    </span>
  );
}
