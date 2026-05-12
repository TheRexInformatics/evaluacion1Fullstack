/**
 * LoginView.jsx — Presenter puro
 * Solo recibe props. Sin useState, sin useEffect, sin fetch.
 */
export default function LoginView({
  username, password, error, loading,
  onUsernameChange, onPasswordChange, onSubmit,
}) {
  function handleKey(e) {
    if (e.key === "Enter") onSubmit();
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-white font-bold text-3xl tracking-tight">
            Smart<span className="text-blue-400">Logix</span>
          </span>
          <p className="text-gray-500 text-sm mt-1">Sistema de Gestión Logística</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-8 space-y-5">
          <div>
            <h1 className="text-white font-semibold text-lg">Iniciar Sesión</h1>
            <p className="text-gray-500 text-xs mt-0.5">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 flex items-start gap-2">
              <span className="text-red-400 text-sm mt-0.5 shrink-0">⚠️</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Usuario */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="admin@smartlogix.cl"
              autoComplete="username"
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 transition"
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 transition"
            />
          </div>

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={loading || !username.trim() || !password}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                       disabled:bg-blue-900 disabled:cursor-not-allowed
                       text-white font-semibold text-sm rounded-lg py-2.5
                       transition-colors duration-150 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Autenticando...
              </>
            ) : (
              "Ingresar al Panel"
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          SmartLogix &copy; {new Date().getFullYear()} · Acceso restringido
        </p>
      </div>
    </div>
  );
}
