import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getViteSupabaseClient } from "@/lib/supabase";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getViteSupabaseClient();
    if (!db) {
      setLoading(false);
      return;
    }

    db.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = db.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}

export async function signInWithEmail(email: string, password: string) {
  const db = getViteSupabaseClient();
  if (!db) throw new Error("Supabase not configured");
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  meta: { full_name: string; username: string },
) {
  const db = getViteSupabaseClient();
  if (!db) throw new Error("Supabase not configured");

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { full_name: meta.full_name, username: meta.username } },
  });
  if (error) throw error;

  // Insert a profile row linked to auth.users
  if (data.user) {
    await db.from("profiles").upsert(
      {
        user_id: data.user.id,
        username: meta.username,
        full_name: meta.full_name,
      },
      { onConflict: "user_id" },
    );
  }

  return data;
}

export async function signOut() {
  const db = getViteSupabaseClient();
  if (!db) return;
  await db.auth.signOut();
}
