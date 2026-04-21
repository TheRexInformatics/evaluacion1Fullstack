const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", section: "Dashboard" },
  { label: "Inventario", icon: "📦", section: "Inventario" },
  { label: "Pedidos", icon: "🛒", section: "Pedidos" },
  { label: "Envíos", icon: "🚚", section: "Envíos" },
];

export default function Sidebar({ activeSection }) {
  return (
    <aside className="w-60 bg-gray-900 flex flex-col shrink-0 h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700">
        <span className="text-white font-bold text-lg tracking-tight">
          Smart<span className="text-blue-400">Logix</span>
        </span>
        <p className="text-gray-500 text-xs mt-0.5">Panel de Control</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, icon, section }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
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
