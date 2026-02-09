"use client";

import { BentoCard } from "@/components/BentoCard";
import { SITE } from "@/lib/constants";
import { useTheme } from "@/components/ThemeProvider";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-32 rounded-lg animate-pulse"
        style={{ backgroundColor: "var(--surface-hover)" }}
      />
    ),
  }
);

export function GitHubGraph() {
  const { theme } = useTheme();

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <BentoCard>
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              GitHub Activity
            </h3>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--accent)" }}
            >
              View Profile
            </a>
          </div>
          <div className="overflow-x-auto">
            <GitHubCalendar
              username="ErnestHysa"
              colorScheme={theme}
              blockSize={12}
              blockMargin={4}
              fontSize={14}
            />
          </div>
        </BentoCard>
      </div>
    </section>
  );
}
