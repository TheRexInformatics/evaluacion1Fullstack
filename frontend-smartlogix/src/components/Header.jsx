import NotificationDropdown from './NotificationDropdown';

export default function Header({ section, userName = "Admin", onLogout }) {
  const now = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const gradientColors = [
    "from-indigo-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
  ];
  const avatarGradient = gradientColors[userName.charCodeAt(0) % gradientColors.length];

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-slate-800 font-semibold text-lg leading-tight">{section}</h1>
        <p className="text-slate-500 text-xs capitalize">{now}</p>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {initials || "AD"}
          </div>
          <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[140px] truncate">
            {userName}
          </span>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="ml-1 p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
