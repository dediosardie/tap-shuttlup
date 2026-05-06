import { Copy, QrCode } from "lucide-react";
import { useState } from "react";
import { NFCStatusBadge } from "@/components/tap/nfc-status-badge";

interface TapCardProps {
  uid: string;
  shortcode: string;
  active: boolean;
  tapCount: number;
  mode: string;
  created: string;
  onToggle?: (uid: string) => void;
}

export function TapCard({ uid, shortcode, active, tapCount, mode, created, onToggle }: TapCardProps) {
  const [copied, setCopied] = useState(false);
  const tapUrl = `https://tap.shuttlup.com/t/${shortcode}`;

  function handleCopy() {
    navigator.clipboard.writeText(tapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="floating-card glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">{uid}</p>
          <p className="font-mono text-xs text-[var(--text-muted)]">t/{shortcode}</p>
        </div>
        <NFCStatusBadge active={active} size="sm" />
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
        <span className="rounded-full border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2.5 py-1 capitalize">
          {mode}
        </span>
        <span className="rounded-full border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2.5 py-1">
          {tapCount.toLocaleString()} taps
        </span>
        <span className="rounded-full border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-2.5 py-1">
          {created}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-1.5">
          <QrCode className="h-3.5 w-3.5 shrink-0 text-[var(--accent-color)]" />
          <span className="truncate font-mono text-xs text-[var(--text-muted)]">{tapUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
            aria-label="Copy tap URL"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={() => onToggle(uid)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400"
                : "bg-[var(--accent-soft)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white"
            }`}
          >
            {active ? "Deactivate" : "Activate"}
          </button>
        )}
      </div>

      {copied && <p className="text-xs text-emerald-400">URL copied to clipboard!</p>}
    </div>
  );
}
