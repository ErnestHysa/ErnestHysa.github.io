"use client";

import { BentoCard } from "@/components/BentoCard";
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

interface GitHubGraphProps {
  contributions: ContributionDay[] | null;
}

export function GitHubGraph({ contributions }: GitHubGraphProps) {
  const { theme } = useTheme();
  const colors = LEVEL_COLORS[theme === "dark" ? "dark" : "light"];

  // Group contributions by week for the grid
  const weeks: ContributionDay[][] = [];
  if (contributions) {
    let currentWeek: ContributionDay[] = [];
    const firstDay = new Date(contributions[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: "", count: 0, level: -1 });
    }
    for (const day of contributions) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  }

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
            <div className="overflow-x-auto">
              <div className="flex gap-[3px] min-w-fit">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <div
                        key={`${wi}-${di}`}
                        className="rounded-sm"
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor:
                            day.level === -1
                              ? "transparent"
                              : colors[day.level] || colors[0],
                        }}
                        title={
                          day.date
                            ? `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`
                            : undefined
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-1.5 mt-3">
                <span
                  className="text-xs mr-1"
                  style={{ color: "var(--text-secondary)" }}
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
                  style={{ color: "var(--text-secondary)" }}
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
