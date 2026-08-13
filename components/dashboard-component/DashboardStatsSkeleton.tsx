"use client";

const skeletonCards = Array.from({ length: 4 }, (_, index) => index);

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[#2f2f2f] ${className}`}
      aria-hidden="true"
    />
  );
}

export function DashboardStatsSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {skeletonCards.map((card) => (
        <div
          key={card}
          className="flex h-[111px] items-center gap-4 rounded-lg bg-[#E6E6E61A] px-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]"
        >
          <SkeletonBlock className="size-12 shrink-0 rounded-full bg-[#412B0A]" />

          <div className="min-w-0 flex-1">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="mt-3 h-8 w-16" />
          </div>
        </div>
      ))}
    </section>
  );
}
