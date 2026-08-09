const ranges = ["1M", "3M", "6M", "1Y"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const yAxis = ["500", "200", "100", "50", "20", "10"];

const chartLine =
  "M 0 166 C 30 165 50 156 78 154 C 107 151 119 144 140 150 C 163 158 184 149 208 151 C 234 153 243 140 266 146 C 290 151 302 133 325 140 C 345 146 360 137 380 145 C 405 155 428 132 458 127 C 481 123 487 138 508 128 C 533 112 553 129 579 119 C 612 107 638 120 664 121 C 695 122 720 128 747 126 C 782 123 790 112 822 107 C 846 103 866 111 889 106 C 923 99 944 84 975 84 C 1002 84 1022 74 1046 67 C 1071 60 1087 69 1110 61 C 1125 55 1138 47 1155 50 C 1176 54 1184 63 1208 58 C 1227 53 1233 44 1248 50 C 1264 56 1280 55 1296 54";

export function ProjectStatisticsChart() {
  return (
    <section className="flex h-[475px] flex-col rounded-lg bg-[#181818] px-4 pb-4 pt-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold leading-6 text-[#dcdcdc]">
          Project Statistics
        </h2>

        <div className="flex items-center gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              className={
                range === "1Y"
                  ? "h-4 rounded-full bg-[#858585] px-2 text-[9px] leading-4 text-[#f1f1f1]"
                  : "h-4 rounded-full border border-[#5f5f5f] px-2 text-[9px] leading-4 text-[#b5b5b5]"
              }
            >
              {range}
            </button>
          ))}
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
          <svg
            viewBox="0 0 1296 232"
            preserveAspectRatio="none"
            className="min-h-0 flex-1 overflow-visible"
            aria-hidden="true"
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
                x2="1296"
                y1={y}
                y2={y}
                stroke="#6b6b6b"
                strokeOpacity="0.65"
                strokeWidth="1"
              />
            ))}

            <line
              x1="58"
              x2="58"
              y1="18"
              y2="232"
              stroke="#7f7f7f"
              strokeDasharray="2 3"
              strokeOpacity="0.65"
            />
            <foreignObject x="42" y="10" width="34" height="24">
              <div className="rounded-sm bg-white px-1.5 py-1 text-center text-[7px] leading-[8px] text-[#333333]">
                March
                <br />
                300
              </div>
            </foreignObject>

            <path d={`${chartLine} L 1296 232 L 0 232 Z`} fill="url(#projectChartFill)" />
            <path
              d={chartLine}
              fill="none"
              stroke="#a36c0b"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.35"
            />
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
