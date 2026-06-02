import Sidebar from "./Sidebar";
import Header from "./Header";
import KpiCard from "./KpiCard";
import RecentOrdersTable from "./RecentOrdersTable";
import StockAlertsList from "./StockAlertsList";
import ActivityFeed from "./ActivityFeed";

export default function DashboardView({ loading, error, data, activeSection }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar activeSection={activeSection} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header section={activeSection} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* KPI Cards */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Resumen del Día
            </h2>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
                : data?.kpis.map((kpi) => <KpiCard key={kpi.id} {...kpi} />)}
            </div>
          </section>

          {/* Middle Row */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Orders Table — takes 2/3 */}
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Pedidos Recientes</h3>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Ver todos →
                </button>
              </div>
              {loading ? (
                <TableSkeleton />
              ) : (
                <RecentOrdersTable orders={data?.recentOrders ?? []} />
              )}
            </div>

            {/* Stock Alerts — takes 1/3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">⚠️ Alertas de Stock</h3>
                <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                  {data?.stockAlerts.length ?? "—"}
                </span>
              </div>
              {loading ? (
                <GenericSkeleton rows={3} />
              ) : (
                {/* <StockAlertsList alerts={data?.stockAlerts ?? []} /> */}
              )}
            </div>
          </section>

          {/* Activity Feed */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Actividad Reciente del Sistema</h3>
            </div>
            {loading ? (
              <GenericSkeleton rows={5} />
            ) : (
              <ActivityFeed events={data?.activityFeed ?? []} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

/* ── Skeleton helpers (inline, no fetch) ─────────────── */
function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-7 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-gray-100 rounded flex-1" />
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function GenericSkeleton({ rows = 4 }) {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-100 rounded w-full" />
      ))}
    </div>
  );
}
