import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="flex h-[111px] items-center gap-4 rounded-lg bg-[#E6E6E61A] px-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
      <div className="flex size-9 w-12 h-12 shrink-0 items-center justify-center rounded-full bg-[#412B0A] text-[#BB7B1D]">
        <Icon className="size-[24px]" strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[20px] leading-5 text-[#D7D7D7]">{title}</p>
        <p className="mt-1 text-[36px] font-semibold leading-8 text-[#E6E6E6]">
          {value}
        </p>
      </div>
    </div>
  );
}
