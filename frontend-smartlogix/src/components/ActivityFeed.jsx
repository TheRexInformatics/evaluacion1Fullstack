const TYPE_CONFIG = {
  order: { icon: "🛒", color: "bg-blue-100 text-blue-600" },
  stock: { icon: "📦", color: "bg-amber-100 text-amber-600" },
  ship: { icon: "🚚", color: "bg-violet-100 text-violet-600" },
  user: { icon: "👤", color: "bg-gray-100 text-gray-500" },
};

export default function ActivityFeed({ events }) {
  return (
    <ul className="divide-y divide-gray-50">
      {events.map((event) => {
        const config = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.user;
        return (
          <li
            key={event.id}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${config.color}`}
            >
              {config.icon}
            </span>
            <p className="text-sm text-gray-600 flex-1">{event.msg}</p>
            <span className="text-xs text-gray-400 font-mono shrink-0">{event.time}</span>
          </li>
        );
      })}
    </ul>
  );
}
