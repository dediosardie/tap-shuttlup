import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ShuttlLogo } from "./ShuttlLogo";

const navLinks = [
  { label: "Tap Home", path: "/" },
  { label: "Demo Card", path: "/tap/demo" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        className={`pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-3 py-2 shadow-[0_20px_45px_-34px_rgba(11,16,32,0.95)] transition-all duration-300 md:px-5 ${
          scrolled
            ? "glass-panel border-border-muted"
            : "border-transparent bg-bg-elevated/35 backdrop-blur-xl"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <ShuttlLogo size="lg" className="h-10 md:h-11" />
        </Link>

        <div className="hidden items-center gap-1 rounded-full surface-primary px-2 py-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                location.pathname === link.path
                  ? "premium-button"
                  : "text-text-secondary hover:bg-accent-soft hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full border border-border-muted px-4 py-2 text-sm text-text-secondary transition-all hover:bg-accent-soft hover:text-text-primary lg:inline-flex"
          >
            Login
          </Link>
          <Link
            to="/tap/demo"
            className="premium-button hidden rounded-full px-5 py-2.5 text-sm lg:inline-flex"
          >
            Open NFC Card
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full surface-primary text-text-primary lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            type="button"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl border border-border-muted glass-panel p-3 lg:hidden"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block rounded-xl px-4 py-3 text-sm transition-all ${
                    location.pathname === link.path
                      ? "premium-button"
                      : "text-text-secondary hover:bg-accent-soft hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid gap-2 border-t border-border-muted/80 pt-3">
              <Link
                to="/login"
                className="rounded-xl border border-border-muted px-4 py-3 text-center text-sm text-text-secondary transition-all hover:bg-accent-soft hover:text-text-primary"
              >
                Login
              </Link>
              <Link to="/tap/demo" className="premium-button rounded-xl px-4 py-3 text-center text-sm">
                Open NFC Card
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
