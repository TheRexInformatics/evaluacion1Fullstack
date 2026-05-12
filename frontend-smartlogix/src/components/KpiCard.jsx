const COLOR_MAP = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
  },
};

export default function KpiCard({ label, value, delta, trend, icon, color }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg ${c.bg}`}>
          {icon}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800 leading-none">{value}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}
        >
          {trend === "up" ? "▲" : "▼"} {delta}
        </span>
      </div>

      {/* Mini trend bar — purely decorative */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${c.text.replace("text-", "bg-")} opacity-60`}
          style={{ width: trend === "up" ? "72%" : "38%" }}
        />
      </div>
    </div>
  );
}
