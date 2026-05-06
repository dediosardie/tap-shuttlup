"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--bg-elevated)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border-muted)",
          "--success-bg": "rgba(16, 185, 129, 0.16)",
          "--success-border": "rgba(16, 185, 129, 0.35)",
          "--error-bg": "rgba(239, 68, 68, 0.16)",
          "--error-border": "rgba(239, 68, 68, 0.35)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
