import { Copy, Download, QrCode } from "lucide-react";
import { useState } from "react";

interface QRCardProps {
  username: string;
  name?: string;
  size?: number;
}

export function QRCard({ username, name, size = 200 }: QRCardProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://tap.shuttlup.com/${username}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=F97316&bgcolor=121212&data=${encodeURIComponent(profileUrl)}`;

  function handleCopy() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-[var(--accent-color)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">QR Code</h3>
        {name && <span className="ml-auto text-xs text-[var(--text-muted)]">{name}</span>}
      </div>

      <div className="flex justify-center">
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-3 accent-glow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR for ${username}`}
            width={size}
            height={size}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <a
          href={qrUrl}
          download={`${username}-qr.png`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent-soft)] py-2 text-xs text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}
