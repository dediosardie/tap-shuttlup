import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { SiteStructuredData, LocalBusinessStructuredData } from "./seo/StructuredData";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="animated-grid-bg relative min-h-screen overflow-x-clip bg-bg-primary text-text-primary">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28)_0%,rgba(37,99,235,0)_70%)] blur-2xl" />
        <div className="absolute right-[-7rem] top-36 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22)_0%,rgba(124,58,237,0)_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16)_0%,rgba(16,185,129,0)_70%)] blur-3xl" />
      </div>

      <SiteStructuredData />
      <LocalBusinessStructuredData />
      <Navbar />
      <main className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

