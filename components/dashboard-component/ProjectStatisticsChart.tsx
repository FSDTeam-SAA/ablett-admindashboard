"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { ProjectStatisticsChartSkeleton } from "./ProjectStatisticsChartSkeleton";

type ProjectStatisticsApiResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  data?: unknown;
};

type MonthStat = {
  month: string;
  value: number;
};

type ChartPoint = MonthStat & {
  x: number;
  y: number;
};

const years = [2026, 2027, 2028];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const chartWidth = 1296;
const chartHeight = 232;
const projectStatisticsQueryKey = "dashboard-project-statistics";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

function getMonthIndex(value: unknown) {
  if (typeof value === "number" && value >= 1 && value <= 12) {
    return value - 1;
  }

  if (typeof value !== "string") {
    return -1;
  }

  const normalized = value.trim().toLowerCase();
  const fullMonthIndex = monthNames.indexOf(normalized);
  if (fullMonthIndex >= 0) return fullMonthIndex;

  return months.findIndex((month) => month.toLowerCase() === normalized.slice(0, 3));
}

function getStatValue(item: Record<string, unknown>) {
  const possibleKeys = [
    "totalProjects",
    "projects",
    "projectCount",
    "count",
    "total",
    "value",
  ];

  for (const key of possibleKeys) {
    const value = item[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return 0;
}

function getItemMonthIndex(item: Record<string, unknown>) {
  const possibleKeys = ["month", "monthName", "name"];

  for (const key of possibleKeys) {
    const monthIndex = getMonthIndex(item[key]);
    if (monthIndex >= 0) return monthIndex;
  }

  return -1;
}

function normalizeProjectStatistics(data: unknown): MonthStat[] {
  const values = Array.from({ length: 12 }, () => 0);
  const source =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>).statistics ??
        (data as Record<string, unknown>).chartData ??
        (data as Record<string, unknown>).monthlyStatistics ??
        (data as Record<string, unknown>).monthlyStats ??
        (data as Record<string, unknown>).projects ??
        data
      : data;

  if (Array.isArray(source)) {
    source.forEach((item, index) => {
      if (typeof item === "number" && Number.isFinite(item)) {
        values[index] = item;
        return;
      }

      if (!item || typeof item !== "object") return;

      const record = item as Record<string, unknown>;
      const monthIndex = getItemMonthIndex(record);

      if (monthIndex >= 0 && monthIndex < 12) {
        values[monthIndex] = getStatValue(record);
      }
    });
  } else if (source && typeof source === "object") {
    Object.entries(source as Record<string, unknown>).forEach(([key, value]) => {
      const monthIndex = getMonthIndex(key);
      if (monthIndex < 0) return;

      if (typeof value === "number" && Number.isFinite(value)) {
        values[monthIndex] = value;
      } else if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
        values[monthIndex] = Number(value);
      } else if (value && typeof value === "object") {
        values[monthIndex] = getStatValue(value as Record<string, unknown>);
      }
    });
  }

  return months.map((month, index) => ({
    month,
    value: values[index],
  }));
}

async function fetchProjectStatistics({
  accessToken,
  year,
}: {
  accessToken?: string;
  year: number;
}) {
  const url = new URL(`${getApiBaseUrl()}/dashboard/project-statistics`);
  url.searchParams.set("year", String(year));

  const response = await fetch(url.toString(), {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data: ProjectStatisticsApiResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(
      data?.message || data?.error || "Failed to fetch project statistics.",
    );
  }

  return normalizeProjectStatistics(data?.data);
}

function getNiceMaxValue(value: number) {
  if (value <= 10) return 10;

  const exponent = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / exponent) * exponent;
}

function buildYAxis(maxValue: number) {
  return Array.from({ length: 6 }, (_, index) =>
    Math.round(maxValue - (maxValue / 5) * index),
  );
}

function buildChartPoints(stats: MonthStat[], maxValue: number): ChartPoint[] {
  return stats.map((stat, index) => ({
    ...stat,
    x: (chartWidth / (stats.length - 1)) * index,
    y: chartHeight - (stat.value / maxValue) * (chartHeight - 12),
  }));
}

function buildSmoothPath(points: ChartPoint[]) {
  return points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = points[index - 1];
      const controlOffset = (point.x - previous.x) / 2;

      return `C ${previous.x + controlOffset} ${previous.y} ${point.x - controlOffset} ${point.y} ${point.x} ${point.y}`;
    })
    .join(" ");
}

export function ProjectStatisticsChart() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;
  const isSessionLoading = sessionStatus === "loading";
  const { data: stats, isLoading } = useQuery({
    queryKey: [projectStatisticsQueryKey, selectedYear, accessToken],
    queryFn: () => fetchProjectStatistics({ accessToken, year: selectedYear }),
    enabled: !isSessionLoading,
  });

  const chartStats = stats ?? months.map((month) => ({ month, value: 0 }));
  const maxStat = Math.max(...chartStats.map((stat) => stat.value));
  const maxValue = getNiceMaxValue(maxStat);
  const yAxis = buildYAxis(maxValue);
  const points = useMemo(
    () => buildChartPoints(chartStats, maxValue),
    [chartStats, maxValue],
  );
  const chartLine = buildSmoothPath(points);
  const activePoint =
    activePointIndex !== null ? points[activePointIndex] : undefined;

  if (isSessionLoading || isLoading) {
    return <ProjectStatisticsChartSkeleton />;
  }

  return (
    <section className="flex h-[475px] flex-col rounded-lg bg-[#181818] px-4 pb-4 pt-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold leading-6 text-[#dcdcdc]">
          Project Statistics
        </h2>

        <div className="flex items-center gap-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                setSelectedYear(year);
                setActivePointIndex(null);
              }}
              className={
                year === selectedYear
                  ? "h-6 rounded-full bg-[#858585] px-3 text-[11px] leading-6 text-[#f1f1f1]"
                  : "h-6 rounded-full border border-[#5f5f5f] px-3 text-[11px] leading-6 text-[#b5b5b5] transition-colors hover:border-[#858585] hover:text-[#f1f1f1]"
              }
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute bottom-5 left-0 top-0 w-8">
          {yAxis.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="absolute left-0 text-[10px] leading-none text-[#9a9a9a]"
              style={{ top: `${index * 20}%` }}
            >
              {value}
            </span>
          ))}
        </div>

        <div className="absolute inset-y-0 left-9 right-0 flex flex-col">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="min-h-0 flex-1 overflow-visible"
            role="img"
            aria-label={`Project statistics for ${selectedYear}`}
            onMouseLeave={() => setActivePointIndex(null)}
          >
            <defs>
              <linearGradient id="projectChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8a5a12" stopOpacity="0.58" />
                <stop offset="100%" stopColor="#8a5a12" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {[0, 46, 92, 139, 185, 231].map((y) => (
              <line
                key={y}
                x1="0"
                x2={chartWidth}
                y1={y}
                y2={y}
                stroke="#6b6b6b"
                strokeOpacity="0.65"
                strokeWidth="1"
              />
            ))}

            <path
              d={`${chartLine} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
              fill="url(#projectChartFill)"
            />
            <path
              d={chartLine}
              fill="none"
              stroke="#a36c0b"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.35"
            />

            {points.map((point, index) => (
              <circle
                key={`${point.month}-point`}
                cx={point.x}
                cy={point.y}
                r={activePointIndex === index ? 5 : 3.5}
                fill="#181818"
                stroke="#bb7b1d"
                strokeWidth={activePointIndex === index ? 2.4 : 1.8}
              />
            ))}

            {activePoint ? (
              <>
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1="18"
                  y2={chartHeight}
                  stroke="#d6a24a"
                  strokeDasharray="2 3"
                  strokeOpacity="0.85"
                />
                <foreignObject
                  x={Math.min(Math.max(activePoint.x - 52, 0), chartWidth - 104)}
                  y={Math.max(activePoint.y - 54, 4)}
                  width="104"
                  height="44"
                >
                  <div className="rounded-md border border-[#4b4b4b] bg-[#f8f8f8] px-2 py-1.5 text-center text-[9px] font-medium leading-[12px] text-[#252525] shadow-lg">
                    {activePoint.month} {selectedYear}
                    <br />
                    {activePoint.value} Projects
                  </div>
                </foreignObject>
              </>
            ) : null}

            {points.map((point, index) => (
              <rect
                key={`${point.month}-hover`}
                x={Math.max(point.x - chartWidth / 24, 0)}
                y="0"
                width={
                  index === 0 || index === points.length - 1
                    ? chartWidth / 12
                    : chartWidth / 12
                }
                height={chartHeight}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${point.month} ${selectedYear}: ${point.value} projects`}
                onMouseEnter={() => setActivePointIndex(index)}
                onFocus={() => setActivePointIndex(index)}
                onBlur={() => setActivePointIndex(null)}
              />
            ))}
          </svg>

          <div className="grid h-5 grid-cols-12 pt-1 text-[10px] text-[#9a9a9a]">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
