const STATUS_TABS = [
  { value: "ALL",       label: "Todos" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "PENDING",   label: "Pendientes" },
  { value: "CANCELLED", label: "Cancelados" },
];

const TAB_ACTIVE = {
  ALL:       "bg-lavender/20 text-lavender",
  CONFIRMED: "bg-emerald-500/20 text-emerald-400",
  PENDING:   "bg-goldenrod/20 text-goldenrod",
  CANCELLED: "bg-tomato/20 text-tomato",
};

export default function FiltrosPedidos({
  filterStatus,
  filterFechaDesde,
  filterFechaHasta,
  onFilterStatus,
  onFilterFechaDesde,
  onFilterFechaHasta,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-lavender/10">
      <div className="flex items-center gap-1.5 bg-white/5 border border-lavender/15 rounded-lg p-1">
        {STATUS_TABS.map(({ value, label }) => {
          const isActive = filterStatus === value;
          return (
            <button
              key={value}
              onClick={() => onFilterStatus(value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? TAB_ACTIVE[value]
                  : "text-white/40 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="hidden sm:block h-6 w-px bg-lavender/10" />

      <div className="flex items-center gap-2 text-xs text-white/40">
        <span className="font-medium text-white/30 uppercase tracking-wide">Desde</span>
        <input
          type="date"
          value={filterFechaDesde}
          onChange={(e) => onFilterFechaDesde(e.target.value)}
          className="border border-lavender/15 rounded-lg px-2.5 py-1.5 text-sm text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-lavender/30 transition"
        />
        <span className="font-medium text-white/30 uppercase tracking-wide">Hasta</span>
        <input
          type="date"
          value={filterFechaHasta}
          onChange={(e) => onFilterFechaHasta(e.target.value)}
          className="border border-lavender/15 rounded-lg px-2.5 py-1.5 text-sm text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-lavender/30 transition"
        />
        {(filterFechaDesde || filterFechaHasta) && (
          <button
            onClick={() => { onFilterFechaDesde(""); onFilterFechaHasta(""); }}
            className="text-white/30 hover:text-tomato text-base leading-none transition-colors"
            title="Limpiar fechas"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
