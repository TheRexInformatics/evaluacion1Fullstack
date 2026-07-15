import Button from './ui/Button';

export default function LoginView({ 
  username, setUsername, 
  password, setPassword, 
  error, success, loading, onSubmit,
  isRegister, onToggle
}) {
  return (
    <div className="min-h-dvh flex relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1c073b, #2f0a58)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(137,96,246,0.08)_0%,_transparent_60%)]" />

      {/* Panel izquierdo — Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 relative px-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-lavender/15 border border-lavender/25 flex items-center justify-center mx-auto mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="#8960F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="font-pixelify text-4xl font-bold text-white mb-3">SmartLogix</h1>
          <p className="text-white/40 text-base leading-relaxed">
            Panel de control para gestión de pedidos, inventario y envíos con arquitectura de microservicios.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-white/25">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Saga Pattern
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
              Microservicios
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-goldenrod" />
              React + Vite
            </span>
          </div>
        </div>
      </div>

      {/* Panel derecho — Formulario */}
      <div className="relative flex items-center justify-center w-full lg:w-[480px] xl:w-[520px] shrink-0 px-6">
        <div className="w-full max-w-sm">
          {/* Logo mobile — solo visible en < lg */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-lavender/20 border border-lavender/30 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8960F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h2 className="font-pixelify text-2xl font-bold text-white">SmartLogix</h2>
          </div>

          <div className="bg-night-purple rounded-2xl shadow-2xl border border-lavender/10 p-8">
            <div className="mb-6">
              <h2 className="font-sans text-xl font-bold text-white">
                {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="text-sm text-white/40 mt-1">
                {isRegister ? 'Regístrate para acceder al panel' : 'Ingresa tus credenciales para continuar'}
              </p>
            </div>

            {success && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm text-center flex items-center gap-2 justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                {success}
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 bg-tomato/10 border border-tomato/20 text-tomato rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Usuario</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-lavender/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 transition-all"
                  placeholder="tu_usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Contraseña</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-lavender/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                loading={loading}
                className="w-full shadow-lg shadow-lavender/25"
              >
                {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={onToggle}
                className="text-sm text-lavender/80 hover:text-lavender font-medium transition-colors"
              >
                {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
