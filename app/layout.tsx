import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tap.shuttlup.com/"),
  title: {
    default: "Shutt'L Up Tap",
    template: "%s | Shutt'L Up Tap",
  },
  description: "NFC-powered digital business card platform for smart mobility identity.",
  openGraph: {
    title: "Shutt'L Up Tap",
    description: "NFC-powered digital business card platform.",
    url: "https://tap.shuttlup.com/",
    siteName: "Shutt'L Up Tap",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shutt'L Up Tap",
    description: "NFC-powered digital business card platform.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
