import KpiCard from "./KpiCard";
import TrendChart from "./TrendChart";
import RecentOrdersTable from "./RecentOrdersTable";
import StockAlertsList from "./StockAlertsList";
import ActivityFeed from "./ActivityFeed";

const GLASS = "bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.25)]";

export default function DashboardView({ loading, error, data, onRefresh, onNavigate, userName }) {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8 max-w-screen-2xl mx-auto w-full">
      {error && (
        <div className="bg-tomato/10 border border-tomato/20 text-tomato rounded-xl p-4 text-sm flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <section className={`${GLASS} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans text-2xl font-bold text-white">
              {loading ? 'Cargando...' : `Bienvenido, ${userName ?? 'Admin'}`}
            </h1>
            <p className="text-sm text-white/40 mt-1">Panel de control — Resumen del día</p>
          </div>
          <button onClick={onRefresh} className="flex items-center gap-1.5 text-xs text-lavender/80 hover:text-lavender font-medium transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refrescar
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">KPIs</h2>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : data?.kpis.map((kpi) => <KpiCard key={kpi.id} {...kpi} />)}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`xl:col-span-2 ${GLASS} overflow-clip`}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Pedidos Recientes</h3>
            <button onClick={() => onNavigate && onNavigate("Pedidos")} className="text-xs text-lavender/80 hover:text-lavender font-medium transition-colors">
              Ver todos →
            </button>
          </div>
          {loading ? (
            <TableSkeleton />
          ) : (
            <RecentOrdersTable pedidos={data?.recentOrders ?? []} onVerDetalle={() => onNavigate && onNavigate("Pedidos")} />
          )}
        </div>

        <div className={`${GLASS} overflow-clip`}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-goldenrod">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Alertas de Stock
            </h3>
            <span className="text-xs bg-goldenrod/10 text-goldenrod font-semibold px-2 py-0.5 rounded-full border border-goldenrod/20">
              {data?.stockAlerts.length ?? "—"}
            </span>
          </div>
          {loading ? (
            <GenericSkeleton rows={3} />
          ) : (
            <StockAlertsList alerts={data?.stockAlerts ?? []} />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <TrendChart />
        </div>
        <div className={`xl:col-span-2 ${GLASS} overflow-clip`}>
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Actividad Reciente</h3>
          </div>
          <ActivityFeed events={data?.activityFeed ?? []} />
        </div>
      </section>

      <footer className="flex items-center justify-between pt-2 pb-1 text-xs text-white/15">
        <span>SmartLogix v1.0 — Microservicios + Saga Pattern</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
          Sistema operativo
        </span>
      </footer>
    </main>
  );
}

function KpiSkeleton() {
  return (
    <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-6 animate-pulse space-y-3">
      <div className="h-3 bg-white/5 rounded w-1/2" />
      <div className="h-7 bg-white/5 rounded w-2/3" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-white/5 rounded flex-1" />
          <div className="h-4 bg-white/5 rounded w-24" />
          <div className="h-4 bg-white/5 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function GenericSkeleton({ rows = 4 }) {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-white/5 rounded w-full" />
      ))}
    </div>
  );
}
