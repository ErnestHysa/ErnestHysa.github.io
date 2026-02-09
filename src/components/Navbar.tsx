"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTheme } from "@/components/ThemeProvider";

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(
    NAV_LINKS.map((l) => l.href.replace("#", "")),
    80
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
          style={{
            backgroundColor: "var(--nav-bg)",
            borderColor: "var(--border)",
          }}
        >
          <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <a
              href="#home"
              className="text-sm font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              EH
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color:
                      activeId === link.href.replace("#", "")
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                  }}
                >
                  {link.label}
                  {activeId === link.href.replace("#", "") && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg -z-10"
                      style={{ backgroundColor: "var(--surface-hover)" }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Right side: theme toggle + resume */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "white",
                }}
              >
                <Download size={14} />
                Resume
              </a>
            </div>

            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="px-6 py-4 flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{
                        color:
                          activeId === link.href.replace("#", "")
                            ? "var(--accent)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/resume.pdf"
                    download
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg mt-2"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "white",
                    }}
                  >
                    <Download size={14} />
                    Resume
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
