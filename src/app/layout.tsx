import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AudioReactiveProvider } from "@/components/AudioReactiveProvider";

export const metadata: Metadata = {
  title: "Ernest Hysa | Full-Stack Developer",
  description:
    "Full-stack developer building web apps, mobile apps, AI tools, and automation systems with TypeScript, Python, React, and more.",
  metadataBase: new URL("https://ernesthysa.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ernest Hysa | Full-Stack Developer",
    description:
      "Portfolio of Ernest Hysa — full-stack developer, AI enthusiast, and builder.",
    url: "https://ernesthysa.github.io",
    siteName: "Ernest Hysa",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ernest Hysa — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ernest Hysa | Full-Stack Developer",
    description:
      "Portfolio of Ernest Hysa — full-stack developer, AI enthusiast, and builder.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "theme-color": "#10b981",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ernest Hysa",
  url: "https://ernesthysa.github.io",
  jobTitle: "Full-Stack Developer",
  sameAs: [
    "https://github.com/ErnestHysa",
    "https://www.linkedin.com/in/ernesthysa",
  ],
  knowsAbout: [
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "React Native",
    "AI/ML",
    "Full-Stack Development",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,800,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider>
          <AudioReactiveProvider>{children}</AudioReactiveProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
