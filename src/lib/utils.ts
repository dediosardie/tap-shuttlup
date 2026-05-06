import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const base = import.meta.env.VITE_APP_URL ?? "https://tap-shuttlup.vercel.app//";
  return new URL(path, base).toString();
}
