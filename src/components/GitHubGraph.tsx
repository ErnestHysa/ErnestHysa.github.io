"use client";

import { useEffect, useState, useCallback } from "react";
import { BentoCard } from "@/components/BentoCard";
import { SITE } from "@/lib/constants";
import { useTheme } from "@/components/ThemeProvider";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

const LEVEL_COLORS = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function GitHubGraph() {
  const { theme } = useTheme();
  const [data, setData] = useState<ContributionDay[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/ErnestHysa?y=last`
      );
      if (!res.ok) throw new Error("API error");
      const json: ContributionData = await res.json();
      setData(json.contributions);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const colors = LEVEL_COLORS[theme === "dark" ? "dark" : "light"];

  // Group contributions by week for the grid
  const weeks: ContributionDay[][] = [];
  if (data) {
    let currentWeek: ContributionDay[] = [];
    const firstDay = new Date(data[0].date).getDay();
    // Pad the first week
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: "", count: 0, level: -1 });
    }
    for (const day of data) {
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

          {loading && (
            <div
              className="h-32 rounded-lg animate-pulse"
              style={{ backgroundColor: "var(--surface-hover)" }}
            />
          )}

          {error && (
            <div className="text-center py-8">
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Could not load contribution data.
              </p>
              <button
                onClick={fetchData}
                className="text-sm font-medium px-4 py-1.5 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "white",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {data && !loading && !error && (
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
