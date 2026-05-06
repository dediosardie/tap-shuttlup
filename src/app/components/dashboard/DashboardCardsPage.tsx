import { useState } from "react";
import { BadgeCheck, Copy, CreditCard, Plus, QrCode, Wifi, XCircle } from "lucide-react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type CardStatus = "active" | "inactive";

interface NfcCard {
  uid: string;
  shortcode: string;
  status: CardStatus;
  taps: number;
  created: string;
  mode: string;
}

const initialCards: NfcCard[] = [
  { uid: "TAP-XX-001", shortcode: "tap001", status: "active", taps: 1925, created: "May 1, 2026", mode: "Fleet" },
  { uid: "TAP-XX-002", shortcode: "tap002", status: "inactive", taps: 441, created: "Apr 18, 2026", mode: "Personal" },
  { uid: "TAP-XX-003", shortcode: "tap003", status: "active", taps: 78, created: "May 5, 2026", mode: "Corporate" },
];

export function DashboardCardsPage() {
  const [cards, setCards] = useState<NfcCard[]>(initialCards);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  function toggleStatus(uid: string) {
    setCards((prev) =>
      prev.map((c) => c.uid === uid ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c)
    );
  }

  function copyUrl(shortcode: string, uid: string) {
    navigator.clipboard.writeText(`https://tap.shuttlup.com/t/${shortcode}`);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  }

  return (
    <DashboardShell title="NFC Cards">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">{cards.length} cards registered</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <QrCode className="h-4 w-4" /> Generate QR
          </button>
          <button
            type="button"
            className="premium-button flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Create NFC Card
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.uid}
            className="floating-card flex flex-col gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 sm:flex-row sm:items-center"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              card.status === "active" ? "bg-[var(--accent-soft)]" : "bg-[var(--bg-elevated)]"
            }`}>
              <CreditCard className={`h-5 w-5 ${card.status === "active" ? "text-[var(--accent-color)]" : "text-[var(--text-disabled)]"}`} />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[var(--text-primary)]">{card.uid}</p>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  card.status === "active"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-[var(--bg-elevated)] text-[var(--text-disabled)]"
                }`}>
                  {card.status === "active" ? <Wifi className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {card.status}
                </span>
                <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                  {card.mode}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Shortcode: <span className="font-mono text-[var(--text-secondary)]">t/{card.shortcode}</span>
                &nbsp;·&nbsp;{card.taps.toLocaleString()} taps
                &nbsp;·&nbsp;Created {card.created}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => copyUrl(card.shortcode, card.uid)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-color)]"
                title="Copy tap URL"
              >
                {copiedUid === card.uid ? <BadgeCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(card.uid)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  card.status === "active"
                    ? "border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400"
                    : "bg-[var(--accent-soft)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white"
                }`}
              >
                {card.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-[var(--text-disabled)]">
        NFC tags store only <span className="font-mono">tap.shuttlup.com/t/[shortcode]</span>.
        The platform handles all redirects and analytics.
      </p>
    </DashboardShell>
  );
}
