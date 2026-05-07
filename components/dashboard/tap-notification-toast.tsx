"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Wifi, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

type TapNotification = {
  id: string;
  source: string;
  device: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export function TapNotificationToast() {
  const [toasts, setToasts] = useState<TapNotification[]>([]);
  const channelRef = useRef<ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]> | null>(null);

  useEffect(() => {
    const db = getSupabaseBrowserClient();
    if (!db) return;

    // Get the authed user's profile id to filter toasts to their own cards
    let profileId: string | null = null;

    async function subscribe() {
      if (!db) return;
      const { data: { user } } = await db.auth.getUser();
      if (!user) return;

      const { data: profile } = await db
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.id) return;
      profileId = profile.id as string;

      channelRef.current = db.channel("tap_notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "tap_analytics",
          },
          async (payload) => {
            if (!db) return;
            const row = payload.new as {
              id: string;
              card_id: string;
              device: string | null;
              city: string | null;
              referrer: string | null;
              latitude: number | null;
              longitude: number | null;
              created_at: string;
            };

            // Verify this card belongs to the authed user
            const { data: card } = await db
              .from("nfc_cards")
              .select("profile_id")
              .eq("id", row.card_id)
              .maybeSingle();

            if (!card || card.profile_id !== profileId) return;

            const notif: TapNotification = {
              id: row.id,
              source: row.referrer ?? "unknown",
              device: row.device,
              city: row.city,
              latitude: row.latitude,
              longitude: row.longitude,
              created_at: row.created_at,
            };

            setToasts((prev) => [notif, ...prev].slice(0, 5));

            // Auto-dismiss after 8 seconds
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.id !== notif.id));
            }, 8000);
          },
        )
        .subscribe();
    }

    void subscribe();

    return () => {
      if (channelRef.current) {
        void channelRef.current.unsubscribe();
      }
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-4 shadow-xl shadow-black/40 animate-in slide-in-from-right-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Wifi className="h-4 w-4 text-[var(--accent-color)]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)] capitalize">{toast.source} detected</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {toast.device ?? "Unknown device"}
              {toast.city ? ` · ${toast.city}` : ""}
            </p>
            {toast.latitude != null && toast.longitude != null && (
              <a
                href={`https://maps.google.com/?q=${toast.latitude},${toast.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline"
              >
                <MapPin className="h-3 w-3" />
                {toast.latitude.toFixed(5)}, {toast.longitude.toFixed(5)}
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="shrink-0 text-[var(--text-disabled)] hover:text-[var(--text-muted)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
