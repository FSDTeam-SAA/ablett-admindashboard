"use client";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const yAxis = ["500", "200", "100", "50", "20", "10"];

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[#2f2f2f] ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProjectStatisticsChartSkeleton() {
  return (
    <section className="flex h-[475px] flex-col rounded-lg bg-[#181818] px-4 pb-4 pt-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SkeletonBlock className="h-6 w-44" />

        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-5 w-12 rounded-full" />
          <SkeletonBlock className="h-5 w-12 rounded-full" />
          <SkeletonBlock className="h-5 w-12 rounded-full" />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute bottom-5 left-0 top-0 w-8">
          {yAxis.map((value, index) => (
            <span
              key={value}
              className="absolute left-0 text-[10px] leading-none text-[#9a9a9a]"
              style={{ top: `${index * 20}%` }}
            >
              {value}
            </span>
          ))}
        </div>

        <div className="absolute inset-y-0 left-9 right-0 flex flex-col">
          <div className="relative min-h-0 flex-1">
            <SkeletonBlock className="absolute left-0 right-0 top-[8%] h-px" />
            <SkeletonBlock className="absolute left-0 right-0 top-[28%] h-px" />
            <SkeletonBlock className="absolute left-0 right-0 top-[48%] h-px" />
            <SkeletonBlock className="absolute left-0 right-0 top-[68%] h-px" />
            <SkeletonBlock className="absolute left-0 right-0 top-[88%] h-px" />
            <SkeletonBlock className="absolute bottom-10 left-[6%] h-24 w-[16%] rounded-full" />
            <SkeletonBlock className="absolute bottom-20 left-[26%] h-28 w-[18%] rounded-full" />
            <SkeletonBlock className="absolute bottom-14 left-[50%] h-20 w-[18%] rounded-full" />
            <SkeletonBlock className="absolute bottom-28 left-[74%] h-24 w-[18%] rounded-full" />
          </div>

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
