import { Link } from "react-router";
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { ShuttlLogo } from "./ShuttlLogo";

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-border-muted/60 bg-bg-primary/80 py-16 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="glass-card floating-card p-6 lg:col-span-2">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <ShuttlLogo size="lg" className="h-12" />
              <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                Shutt'L Up Tap is a premium NFC digital business card platform for professionals and teams that need faster and smarter contact sharing.
              </p>
              <div className="flex items-center gap-2">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-muted bg-bg-elevated text-text-muted transition-all hover:-translate-y-0.5 hover:border-accent-color/45 hover:text-accent-color"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-border-muted/70 bg-bg-secondary/65 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">Mobility Intelligence</h4>
              <p className="text-sm text-text-muted">
                Launch verified digital profiles, collect tap analytics, and make every introduction instant with one NFC tap.
              </p>
              <Link to="/tap/demo" className="premium-button inline-flex rounded-full px-5 py-2.5 text-sm">
                View Demo Card
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Tap Home", path: "/" },
                { label: "Demo NFC Card", path: "/tap/demo" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-muted transition-colors hover:text-accent-color"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">Platform</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>NFC Profile Pages</li>
              <li>Tap Analytics</li>
              <li>QR Backup Cards</li>
              <li>Team Identity Management</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">Contact Info</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-color" />
              <span>Lot 10, Capri Access Road, Km 23 W Service Rd, Cupang, Muntinlupa, 1771 Metro Manila</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-text-muted">
              <Mail className="h-4 w-4 shrink-0 text-accent-color" />
              <span>info@shuttlup.com</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-text-muted">
              <Phone className="h-4 w-4 shrink-0 text-accent-color" />
              <span>+63 917-816-1707</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-border-muted/70 pt-8 text-sm text-text-disabled lg:col-span-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>&copy; 2026 Shutt'L Up. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/" className="transition-colors hover:text-accent-color">Shutt'L Up Tap</Link>
              <Link to="/tap/demo" className="transition-colors hover:text-accent-color">Demo Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}