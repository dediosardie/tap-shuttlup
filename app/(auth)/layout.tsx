import Link from "next/link";
import { Wifi } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="animated-grid-bg relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-20 blur-[160px]"
          style={{ background: "var(--glow-orange)" }}
        />
        <div
          className="absolute -bottom-32 right-0 h-[320px] w-[320px] rounded-full opacity-15 blur-[110px]"
          style={{ background: "var(--glow-purple)" }}
        />
        <div
          className="absolute top-1/2 left-0 h-[200px] w-[200px] -translate-y-1/2 rounded-full opacity-10 blur-[80px]"
          style={{ background: "rgba(249,115,22,0.4)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <Link
          href="/"
          className="mb-10 flex flex-col items-center gap-3 no-underline outline-none"
          tabIndex={-1}
          aria-label="Back to home"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_8px_32px_-8px_rgba(249,115,22,0.65)]"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Wifi className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Shutt&apos;L Up{" "}
              <span style={{ color: "var(--accent-color)" }}>Tap</span>
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              NFC-Powered Digital Identity
            </p>
          </div>
        </Link>

        {children}
      </div>
    </div>
  );
}
