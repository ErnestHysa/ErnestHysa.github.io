"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE } from "@/lib/constants";
import { useTheme } from "@/components/ThemeProvider";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const LEVEL_COLORS = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

interface GitHubGraphProps {
  contributions: ContributionDay[] | null;
}

export function GitHubGraph({ contributions }: GitHubGraphProps) {
  const { theme } = useTheme();
  const colors = LEVEL_COLORS[theme === "dark" ? "dark" : "light"];
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const { weeks, totalContributions, monthLabels } = useMemo(() => {
    const w: ContributionDay[][] = [];
    let total = 0;
    const months: { label: string; index: number }[] = [];

    if (contributions) {
      let currentWeek: ContributionDay[] = [];
      const firstDay = new Date(contributions[0].date).getDay();

      for (let i = 0; i < firstDay; i++) {
        currentWeek.push({ date: "", count: 0, level: -1 });
      }

      let lastMonth = -1;
      for (const day of contributions) {
        total += day.count;
        const month = new Date(day.date).getMonth();
        if (month !== lastMonth) {
          months.push({
            label: new Date(day.date).toLocaleString("en", { month: "short" }),
            index: w.length,
          });
          lastMonth = month;
        }
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          w.push(currentWeek);
          currentWeek = [];
        }
      }
      if (currentWeek.length > 0) {
        w.push(currentWeek);
      }
    }

    return { weeks: w, totalContributions: total, monthLabels: months };
  }, [contributions]);

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <BentoCard>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className="text-lg font-bold mb-1"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                GitHub Activity
              </h3>
              {contributions && (
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {totalContributions.toLocaleString()}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    contributions in the last year
                  </span>
                </div>
              )}
            </div>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors px-3 py-1.5 rounded-lg border"
              style={{
                color: "var(--accent)",
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              View Profile
            </a>
          </div>

          {!contributions && (
            <p
              className="text-sm text-center py-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Contribution data unavailable. Visit my{" "}
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                GitHub profile
              </a>{" "}
              to see my activity.
            </p>
          )}

          {contributions && (
            <div className="overflow-x-auto mt-4 relative">
              {/* Month labels */}
              <div className="flex mb-1 ml-8" style={{ gap: "3px" }}>
                {weeks.map((_, wi) => {
                  const monthLabel = monthLabels.find((m) => m.index === wi);
                  return (
                    <div
                      key={wi}
                      className="text-xs"
                      style={{
                        width: 12,
                        color: "var(--text-tertiary)",
                        fontSize: 10,
                      }}
                    >
                      {monthLabel ? monthLabel.label : ""}
                    </div>
                  );
                })}
              </div>

              <div className="flex">
                {/* Day labels */}
                <div
                  className="flex flex-col mr-1 shrink-0"
                  style={{ gap: "3px" }}
                >
                  {DAY_LABELS.map((label, i) => (
                    <div
                      key={i}
                      className="text-xs flex items-center justify-end"
                      style={{
                        height: 12,
                        width: 28,
                        color: "var(--text-tertiary)",
                        fontSize: 10,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex min-w-fit" style={{ gap: "3px" }}>
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col" style={{ gap: "3px" }}>
                      {week.map((day, di) => (
                        <div
                          key={`${wi}-${di}`}
                          className="rounded-sm transition-transform cursor-default"
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor:
                              day.level === -1
                                ? "transparent"
                                : colors[day.level] || colors[0],
                            boxShadow:
                              day.level >= 3
                                ? `0 0 6px ${colors[day.level]}40`
                                : undefined,
                          }}
                          onMouseEnter={(e) => {
                            if (day.date) {
                              setHoveredDay(day);
                              const rect = e.currentTarget.getBoundingClientRect();
                              const parent = e.currentTarget.closest(".overflow-x-auto")?.getBoundingClientRect();
                              if (parent) {
                                setHoverPos({
                                  x: rect.left - parent.left + 6,
                                  y: rect.top - parent.top - 40,
                                });
                              }
                            }
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tooltip */}
              {hoveredDay && (
                <div
                  className="absolute pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-medium z-10"
                  style={{
                    left: hoverPos.x,
                    top: hoverPos.y,
                    backgroundColor: "var(--surface-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <strong>{hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""}</strong>
                  {" on "}
                  {new Date(hoveredDay.date).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center justify-end gap-1.5 mt-3">
                <span
                  className="text-xs mr-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Less
                </span>
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: color,
                    }}
                  />
                ))}
                <span
                  className="text-xs ml-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  More
                </span>
              </div>
            </div>
          )}
        </BentoCard>
      </div>
    </section>
  );
}
