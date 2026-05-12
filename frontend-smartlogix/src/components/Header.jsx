export default function Header({ section, userName = "Admin", onLogout }) {
  const now = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-gray-800 font-semibold text-base">{section}</h1>
        <p className="text-gray-400 text-xs capitalize">{now}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Campana de notificaciones */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-gray-500 text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Buscador */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar pedido, SKU..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-40"
          />
        </div>

        {/* Avatar + nombre + logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials || "AD"}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {userName}
          </span>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="ml-1 p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            {/* Icono logout */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd"/>
              <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.08a.75.75 0 1 0-1.004-1.11l-2.5 2.5a.75.75 0 0 0 0 1.08l2.5 2.5a.75.75 0 1 0 1.004-1.11L8.704 10.75H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
