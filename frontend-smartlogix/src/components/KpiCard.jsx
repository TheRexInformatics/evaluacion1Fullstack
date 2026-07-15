import { useState } from "react";

const COLOR_MAP = {
  blue:    { text: "text-lavender",  border: "border-lavender/30",  glow: "0 0 20px -5px rgba(137,96,246,0.3)",   glowHover: "0 0 30px -2px rgba(137,96,246,0.5)" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", glow: "0 0 20px -5px rgba(52,211,153,0.3)",  glowHover: "0 0 30px -2px rgba(52,211,153,0.5)" },
  amber:   { text: "text-goldenrod", border: "border-goldenrod/30", glow: "0 0 20px -5px rgba(218,165,32,0.3)",   glowHover: "0 0 30px -2px rgba(218,165,32,0.5)" },
  violet:  { text: "text-lavender",  border: "border-lavender/30",  glow: "0 0 20px -5px rgba(137,96,246,0.3)",   glowHover: "0 0 30px -2px rgba(137,96,246,0.5)" },
};

const KPI_ICONS = {
  pedidos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ingresos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  entregados: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  pendientes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
};

function getKpiIcon(title) {
  const t = (title || "").toLowerCase();
  if (t.includes("pedido")) return KPI_ICONS.pedidos;
  if (t.includes("ingreso")) return KPI_ICONS.ingresos;
  if (t.includes("entregado")) return KPI_ICONS.entregados;
  if (t.includes("pendiente")) return KPI_ICONS.pendientes;
  return KPI_ICONS.default;
}

export default function KpiCard({ label, title, value, delta, trend, icon, color }) {
  const [hovered, setHovered] = useState(false);
  const displayLabel = label || title || "";
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-night-purple rounded-2xl border ${c.border} p-6 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300`}
      style={{ boxShadow: hovered ? c.glowHover : c.glow }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-heading uppercase tracking-wider text-white/50">
          {displayLabel}
        </span>
        <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 shrink-0">
          <span className={c.text}>{icon || getKpiIcon(displayLabel)}</span>
        </span>
      </div>

      <div className="flex items-end justify-between mt-1">
        <span className="font-heading text-3xl font-bold text-white tracking-wide tabular-nums">
          {value}
        </span>
        {delta && (
          <span className={`text-xs font-share-tech px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ${c.text}`}>
            {trend === "up" ? "▲" : "▼"} {delta}
          </span>
        )}
      </div>
    </div>
  );
}