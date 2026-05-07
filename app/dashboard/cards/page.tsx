"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "../../../components/dashboard/dashboard-shell";
import { BadgeCheck, Copy, CreditCard, Pencil, Plus, QrCode, Trash2, Wifi, XCircle } from "lucide-react";
import {
  createCard,
  deleteCard,
  readCards,
  updateCard,
  type DashboardCard,
} from "@/lib/dashboard-crud";
import type { ModeType } from "../../../lib/types";

export default function DashboardCardsPage() {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ uid: "", shortcode: "", mode: "corporate" as ModeType });
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    void readCards().then(setCards);
  }, []);

  function persist(next: DashboardCard[]) {
    setCards(next);
  }

  async function toggleStatus(card: DashboardCard) {
    const next: DashboardCard = { ...card, status: card.status === "active" ? "inactive" : "active" };
    await updateCard(next);
    persist(cards.map((c) => (c.id === card.id ? next : c)));
  }

  function copyUrl(shortcode: string, uid: string) {
    navigator.clipboard.writeText(`https://tap.shuttlup.com/t/${shortcode}`);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  }

  async function handleCreate() {
    if (!form.uid || !form.shortcode) {
      setMessage("UID and shortcode are required.");
      return;
    }
    try {
      const created = await createCard({
        uid: form.uid,
        shortcode: form.shortcode,
        mode: form.mode,
        status: "active",
      });
      persist([created, ...cards]);
      setForm({ uid: "", shortcode: "", mode: "corporate" });
      setMessage("Card created successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create card.");
    }
  }

  async function handleDelete(id: string) {
    await deleteCard(id);
    persist(cards.filter((c) => c.id !== id));
  }

  async function handleInlineUpdate(card: DashboardCard, patch: Partial<DashboardCard>) {
    const next = { ...card, ...patch };
    await updateCard(next);
    persist(cards.map((c) => (c.id === card.id ? next : c)));
  }

  function handleGenerateQr() {
    const target = cards[0]?.shortcode || form.shortcode;
    if (!target) {
      setMessage("Create a card or enter a shortcode first.");
      return;
    }

    const tapUrl = `https://tap.shuttlup.com/t/${target}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&color=F97316&bgcolor=121212&data=${encodeURIComponent(tapUrl)}`;
    window.open(qrUrl, "_blank", "noopener,noreferrer");
    setMessage(`Generated QR for ${target}.`);
  }

  return (
    <DashboardShell title="NFC Cards">
      {/* Header actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">{cards.length} cards registered</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerateQr}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <QrCode className="h-4 w-4" /> Generate QR
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="premium-button flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Create NFC Card
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 sm:grid-cols-4">
        <input
          value={form.uid}
          onChange={(e) => setForm((p) => ({ ...p, uid: e.target.value }))}
          placeholder="Card UID"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <input
          value={form.shortcode}
          onChange={(e) => setForm((p) => ({ ...p, shortcode: e.target.value }))}
          placeholder="Shortcode"
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <select
          value={form.mode}
          onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value as ModeType }))}
          className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="personal">Personal</option>
          <option value="corporate">Corporate</option>
          <option value="driver">Driver</option>
          <option value="fleet">Fleet</option>
          <option value="investor">Investor</option>
        </select>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-xl bg-[var(--accent-color)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Add Card
        </button>
      </div>

      {message ? (
        <p className="mb-4 text-xs text-[var(--text-muted)]">{message}</p>
      ) : null}

      {/* Cards list */}
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.uid}
            className="floating-card flex flex-col gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-5 sm:flex-row sm:items-center"
          >
            {/* Icon */}
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              card.status === "active"
                ? "bg-[var(--accent-soft)]"
                : "bg-[var(--bg-elevated)]"
            }`}>
              <CreditCard className={`h-5 w-5 ${card.status === "active" ? "text-[var(--accent-color)]" : "text-[var(--text-disabled)]"}`} />
            </div>

            {/* Info */}
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

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => copyUrl(card.shortcode, card.uid)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
                title="Copy tap URL"
              >
                {copiedUid === card.uid ? <BadgeCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setEditingId((v) => (v === card.id ? null : card.id))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title="Edit card"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(card)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  card.status === "active"
                    ? "border border-[var(--border-muted)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400"
                    : "bg-[var(--accent-soft)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white"
                }`}
              >
                {card.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(card.id)}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {editingId === card.id ? (
              <div className="grid w-full gap-2 sm:grid-cols-3">
                <input
                  value={card.uid}
                  onChange={(e) => handleInlineUpdate(card, { uid: e.target.value })}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                />
                <input
                  value={card.shortcode}
                  onChange={(e) => handleInlineUpdate(card, { shortcode: e.target.value })}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                />
                <select
                  value={card.mode}
                  onChange={(e) => handleInlineUpdate(card, { mode: e.target.value as ModeType })}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                >
                  <option value="personal">Personal</option>
                  <option value="corporate">Corporate</option>
                  <option value="driver">Driver</option>
                  <option value="fleet">Fleet</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Empty state hint */}
      <p className="mt-5 text-xs text-[var(--text-disabled)]">
        NFC tags store only <span className="font-mono">tap.shuttlup.com/t/[shortcode]</span>.
        The platform handles all redirects and analytics.
      </p>
    </DashboardShell>
  );
}

