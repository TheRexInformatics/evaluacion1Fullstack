import { useState } from "react";

const COLOR_MAP = {
  blue:    { text: "text-lavender",  glow: "0 0 24px -8px #8960F6",   glowHover: "0 0 32px -4px #8960F6" },
  emerald: { text: "text-emerald-400", glow: "0 0 24px -8px #34d399", glowHover: "0 0 32px -4px #34d399" },
  amber:   { text: "text-goldenrod", glow: "0 0 24px -8px #DAA520",  glowHover: "0 0 32px -4px #DAA520" },
  violet:  { text: "text-lavender",  glow: "0 0 24px -8px #8960F6",   glowHover: "0 0 32px -4px #8960F6" },
};

const KPI_ICONS = {
  pedidos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ingresos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  entregados: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  pendientes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
      className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-200"
      style={{ boxShadow: hovered ? c.glowHover : c.glow }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          {displayLabel}
        </span>
        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-sm">
          <span className={c.text}>{icon || getKpiIcon(displayLabel)}</span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-sans text-2xl font-bold text-white leading-none tabular-nums">{value}</span>
        {delta && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] ${c.text}`}>
            {trend === "up" ? "▲" : "▼"} {delta}
          </span>
        )}
      </div>
    </div>
  );
}
