"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

const socialLinks = [
  { icon: Github, href: SITE.github, label: "GitHub" },
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${SITE.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative py-12 px-6">
      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl flex flex-col items-center gap-6">
        {/* Social icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="p-2.5 rounded-xl border transition-colors"
              style={{
                color: "var(--text-tertiary)",
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--surface)",
              }}
              whileHover={{
                scale: 1.1,
                borderColor: "var(--accent)",
                color: "var(--accent)",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              aria-label={link.label}
            >
              <link.icon size={18} />
            </motion.a>
          ))}
        </div>

        <p
          className="text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Designed &amp; built by Ernest Hysa &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
