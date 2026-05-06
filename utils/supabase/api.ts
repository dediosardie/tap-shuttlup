import { projectId, publicAnonKey } from "./info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/server/make-server-fb6c0f85`;

export interface ContactFormData {
  fullName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  type?: "contact" | "demo";
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${publicAnonKey}`,
      "apikey": publicAnonKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to send message" }));
    throw new Error(err.error || "Failed to send message");
  }

  return res.json();
}
