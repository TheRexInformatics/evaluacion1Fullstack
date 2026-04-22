export default function Header({ section }) {
  const now = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-gray-800 font-semibold text-base">{section}</h1>
        <p className="text-gray-400 text-xs capitalize">{now}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Campanita de busqueda */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-gray-500 text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar pedido, SKU..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-44"
          />
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
      </div>
    </header>
  );
}
