"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, Download, ArrowUpRight } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE, FORMSPREE_ID } from "@/lib/constants";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const socialLinks = [
    {
      label: "Email",
      href: `mailto:${SITE.email}`,
      icon: Mail,
      text: SITE.email,
      color: "#ea4335",
    },
    {
      label: "GitHub",
      href: SITE.github,
      icon: Github,
      text: "ErnestHysa",
      color: "#6e5494",
    },
    {
      label: "LinkedIn",
      href: SITE.linkedin,
      icon: Linkedin,
      text: "ernesthysa",
      color: "#0a66c2",
    },
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Contact" title="Get In Touch" />
        <p
          className="text-center text-base mb-12 -mt-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Let&apos;s build something together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Contact Form */}
          <BentoCard delay={0}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus-glow"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus-glow"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 resize-none focus-glow"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 text-white"
                style={{
                  background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={14} />
                {status === "sending"
                  ? "Sending..."
                  : status === "sent"
                    ? "Sent!"
                    : "Send Message"}
              </motion.button>

              {status === "error" && (
                <p className="text-sm text-red-500" role="alert">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
              {status === "sent" && (
                <p
                  className="text-sm"
                  role="status"
                  style={{ color: "var(--accent)" }}
                >
                  Thanks for reaching out! I&apos;ll get back to you soon.
                </p>
              )}
            </form>
          </BentoCard>

          {/* Direct Links */}
          <BentoCard delay={0.1}>
            <h3
              className="text-lg font-bold mb-6"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              Connect
            </h3>

            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all border"
                  style={{
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--surface-hover)",
                  }}
                  whileHover={{
                    borderColor: "var(--border)",
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.06)",
                    x: 4,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  aria-label={link.label}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${link.color}15`,
                      color: link.color,
                    }}
                  >
                    <link.icon size={16} />
                  </div>
                  <span className="text-sm font-medium flex-1">{link.text}</span>
                  <ArrowUpRight
                    size={14}
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </motion.a>
              ))}

              <motion.a
                href="/resume.pdf"
                download
                className="flex items-center gap-3 p-3 rounded-xl transition-all border"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--surface-hover)",
                }}
                whileHover={{
                  borderColor: "var(--border)",
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.06)",
                  x: 4,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                  }}
                >
                  <Download size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium flex-1">Download Resume</span>
                <ArrowUpRight
                  size={14}
                  style={{ color: "var(--text-tertiary)" }}
                />
              </motion.a>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
