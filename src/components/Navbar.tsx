"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTheme } from "@/components/ThemeProvider";

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = useMemo(() => NAV_LINKS.map((l) => l.href.replace("#", "")), []);
  const activeId = useScrollSpy(sectionIds, 80);
  const { theme, cinematicToggle } = useTheme();

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cinematicToggle(rect);
  };

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
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl"
          style={{
            backgroundColor: "var(--nav-bg)",
          }}
        >
          {/* Bottom glow line instead of hard border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, var(--border), var(--accent-glow), var(--border), transparent)",
            }}
          />

          <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <a
              href="#home"
              className="text-sm font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
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
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Right side: theme toggle + resume */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              <motion.a
                href="/resume.pdf"
                download
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={14} />
                Resume
              </motion.a>
            </div>

            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <motion.button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                whileTap={{ scale: 0.9 }}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
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
                className="md:hidden overflow-hidden"
                style={{
                  backgroundColor: "var(--surface-elevated)",
                  borderTop: "1px solid var(--border-subtle)",
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
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold rounded-xl mt-2 text-white"
                    style={{
                      background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
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
