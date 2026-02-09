"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, Download } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
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
    },
    {
      label: "GitHub",
      href: SITE.github,
      icon: Github,
      text: "ErnestHysa",
    },
    {
      label: "LinkedIn",
      href: SITE.linkedin,
      icon: Linkedin,
      text: "ernesthysa",
    },
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Get In Touch
        </motion.h2>

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
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
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
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
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
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "white",
                }}
              >
                <Send size={14} />
                {status === "sending"
                  ? "Sending..."
                  : status === "sent"
                    ? "Sent!"
                    : "Send Message"}
              </button>

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
              style={{ color: "var(--text-primary)" }}
            >
              Connect
            </h3>

            <div className="flex flex-col gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label={link.label}
                >
                  <link.icon size={20} style={{ color: "var(--accent)" }} />
                  <span className="text-sm font-medium">{link.text}</span>
                </a>
              ))}

              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <Download size={20} style={{ color: "var(--accent)" }} />
                <span className="text-sm font-medium">Download Resume</span>
              </a>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
