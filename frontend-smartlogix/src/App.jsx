import { useState, useEffect } from "react";
import PedidosContainer from "./containers/PedidosContainer";


/* ─────────────────────────────────────────────────────────
   FACADE LAYER (simulada)
───────────────────────────────────────────────────────── */
async function fetchDashboardData() {
  await new Promise((r) => setTimeout(r, 1100));
  return {
    kpis: [
      { id: "orders", label: "Pedidos Hoy", value: "1,284", delta: "+12%", trend: "up", icon: "🛒", color: "blue" },
      { id: "revenue", label: "Ingresos del Día", value: "$48,320", delta: "+8.4%", trend: "up", icon: "💰", color: "emerald" },
      { id: "stock", label: "Alertas de Stock", value: "7", delta: "-2 vs ayer", trend: "down", icon: "📦", color: "amber" },
      { id: "shipments", label: "Envíos en Tránsito", value: "342", delta: "+5%", trend: "up", icon: "🚚", color: "violet" },
    ],
    recentOrders: [
      { id: "ORD-9021", client: "Distribuidora Norte", items: 14, total: "$2,450", status: "CONFIRMED", time: "Hace 3 min" },
      { id: "ORD-9020", client: "Mercados del Sur S.A.", items: 6, total: "$890", status: "PENDING", time: "Hace 11 min" },
      { id: "ORD-9019", client: "LogiCorp Chile", items: 22, total: "$5,120", status: "CONFIRMED", time: "Hace 28 min" },
      { id: "ORD-9018", client: "Retail Express", items: 3, total: "$210", status: "CANCELLED", time: "Hace 45 min" },
      { id: "ORD-9017", client: "Grupo Andino", items: 9, total: "$1,670", status: "PENDING", time: "Hace 1 h" },
    ],
    stockAlerts: [
      { sku: "SKU-4412", name: "Caja Cartón 50x40", stock: 3, min: 20, warehouse: "Bodega A" },
      { sku: "SKU-2201", name: "Pallet Madera Std", stock: 7, min: 15, warehouse: "Bodega B" },
      { sku: "SKU-8834", name: "Film Stretch 500m", stock: 1, min: 10, warehouse: "Bodega A" },
    ],
    activityFeed: [
      { id: 1, type: "order", msg: "Pedido ORD-9021 confirmado por Saga", time: "03:14" },
      { id: 2, type: "stock", msg: "Stock crítico en SKU-8834 detectado", time: "03:02" },
      { id: 3, type: "ship", msg: "Envío SHP-441 despachado desde Bodega A", time: "02:50" },
      { id: 4, type: "order", msg: "Pedido ORD-9018 compensado (CANCELLED)", time: "02:31" },
      { id: 5, type: "user", msg: "Admin actualizó tarifas de envío zona sur", time: "02:10" },
    ],
  };
}

/* ─────────────────────────────────────────────────────────
   PRESENTER: Sidebar
───────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", section: "Dashboard" },
  { label: "Inventario", icon: "📦", section: "Inventario" },
  { label: "Pedidos", icon: "🛒", section: "Pedidos" },
  { label: "Envíos", icon: "🚚", section: "Envíos" },
];

function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside style={{ width: 232, minWidth: 232 }} className="bg-gray-900 flex flex-col h-full">
      <div className="px-5 py-5 border-b border-gray-700">
        <span className="text-white font-bold text-lg tracking-tight">
          Smart<span className="text-blue-400">Logix</span>
        </span>
        <p className="text-gray-500 text-xs mt-0.5">Panel de Control</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, icon, section }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => onNavigate(section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-gray-200 text-xs font-medium truncate">Admin SmartLogix</p>
            <p className="text-gray-500 text-xs truncate">admin@smartlogix.cl</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────
   PRESENTER: Header
───────────────────────────────────────────────────────── */
function Header({ section }) {
  const now = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-gray-800 font-semibold text-base">{section}</h1>
        <p className="text-gray-400 text-xs capitalize">{now}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-gray-500 text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar pedido, SKU..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-40"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   PRESENTER: KpiCard
───────────────────────────────────────────────────────── */
const COLOR_MAP = {
  blue:    { bg: "bg-blue-50",    badge: "bg-blue-100 text-blue-700",     bar: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50",   badge: "bg-amber-100 text-amber-700",   bar: "bg-amber-400" },
  violet:  { bg: "bg-violet-50",  badge: "bg-violet-100 text-violet-700", bar: "bg-violet-500" },
};

function KpiCard({ label, value, delta, trend, icon, color }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg ${c.bg}`}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800 leading-none">{value}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
          {trend === "up" ? "▲" : "▼"} {delta}
        </span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar} opacity-60`} style={{ width: trend === "up" ? "72%" : "38%" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PRESENTER: RecentOrdersTable
───────────────────────────────────────────────────────── */
const STATUS_STYLES = {
  CONFIRMED: "bg-green-100 text-green-800",
  PENDING:   "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};
const STATUS_LABELS = { CONFIRMED: "Confirmado", PENDING: "Pendiente", CANCELLED: "Cancelado" };

function SagaBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function RecentOrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Pedido", "Cliente", "Ítems", "Total", "Estado Saga", "Hora"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50 transition-colors duration-100 cursor-pointer">
              <td className="px-5 py-3.5 font-mono font-semibold text-gray-700 text-xs">{o.id}</td>
              <td className="px-5 py-3.5 text-gray-700 font-medium">{o.client}</td>
              <td className="px-5 py-3.5 text-gray-500">{o.items}</td>
              <td className="px-5 py-3.5 text-gray-800 font-semibold">{o.total}</td>
              <td className="px-5 py-3.5"><SagaBadge status={o.status} /></td>
              <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{o.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PRESENTER: StockAlertsList
───────────────────────────────────────────────────────── */
function StockAlertsList({ alerts }) {
  return (
    <ul className="divide-y divide-gray-50">
      {alerts.map((a) => {
        const pct = Math.round((a.stock / a.min) * 100);
        return (
          <li key={a.sku} className="px-5 py-4 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-700">{a.name}</p>
                <p className="text-xs text-gray-400">{a.sku} · {a.warehouse}</p>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {a.stock} / {a.min} uds
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-red-400 transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────────
   PRESENTER: ActivityFeed
───────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  order: { icon: "🛒", color: "bg-blue-100 text-blue-600" },
  stock: { icon: "📦", color: "bg-amber-100 text-amber-600" },
  ship:  { icon: "🚚", color: "bg-violet-100 text-violet-600" },
  user:  { icon: "👤", color: "bg-gray-100 text-gray-500" },
};

function ActivityFeed({ events }) {
  return (
    <ul className="divide-y divide-gray-50">
      {events.map((e) => {
        const cfg = TYPE_CONFIG[e.type] ?? TYPE_CONFIG.user;
        return (
          <li key={e.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${cfg.color}`}>{cfg.icon}</span>
            <p className="text-sm text-gray-600 flex-1">{e.msg}</p>
            <span className="text-xs text-gray-400 font-mono shrink-0">{e.time}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────────
   SKELETONS
───────────────────────────────────────────────────────── */
function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-7 bg-gray-200 rounded w-2/3" />
      <div className="h-2 bg-gray-100 rounded w-full" />
    </div>
  );
}
function RowSkeleton() {
  return (
    <div className="px-5 py-3.5 flex gap-4 animate-pulse">
      <div className="h-4 bg-gray-100 rounded flex-1" />
      <div className="h-4 bg-gray-100 rounded w-24" />
      <div className="h-4 bg-gray-100 rounded w-16" />
    </div>
  );
}
function LineSkeleton({ rows = 4 }) {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-100 rounded w-full" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PLACEHOLDER — secciones no implementadas aún
───────────────────────────────────────────────────────── */
function PlaceholderSection({ section }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-4xl">🚧</p>
        <p className="text-gray-400 text-sm">Módulo <span className="font-semibold text-gray-600">{section}</span> — próximamente</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTAINER: DashboardContainer
───────────────────────────────────────────────────────── */
function DashboardContainer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* KPI Cards */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Resumen del Día</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : data?.kpis.map((kpi) => <KpiCard key={kpi.id} {...kpi} />)}
        </div>
      </section>

      {/* Middle Row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Pedidos Recientes</h3>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">Ver todos →</button>
          </div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
            : <RecentOrdersTable orders={data?.recentOrders ?? []} />}
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">⚠️ Alertas de Stock</h3>
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
              {loading ? "—" : data?.stockAlerts.length}
            </span>
          </div>
          {loading ? <LineSkeleton rows={3} /> : <StockAlertsList alerts={data?.stockAlerts ?? []} />}
        </div>
      </section>

      {/* Activity Feed */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Actividad Reciente del Sistema</h3>
        </div>
        {loading ? <LineSkeleton rows={5} /> : <ActivityFeed events={data?.activityFeed ?? []} />}
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────── */
export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header section={activeSection} />

        {activeSection === "Dashboard"
         && <DashboardContainer />}
        {activeSection === "Pedidos" 
        && <PedidosContainer />
        }

        {/* 3.(Los que aún no programamos) */}
        {(activeSection === "Inventario" || activeSection === "Envíos") && (
          <PlaceholderSection section={activeSection} />
        )}
      </div>
    </div>
  );
}
