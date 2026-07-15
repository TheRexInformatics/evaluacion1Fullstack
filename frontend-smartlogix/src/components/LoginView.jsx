import Button from './ui/Button';

export default function LoginView({ 
  username, setUsername, 
  password, setPassword, 
  error, success, loading, onSubmit,
  isRegister, onToggle
}) {
  return (
    <div className="min-h-dvh flex relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1c073b, #2f0a58)' }}>
      {/* Resplandor místico de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(137,96,246,0.12)_0%,_transparent_65%)]" />

      {/* Panel izquierdo — Branding de SmartLogix */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 relative px-12 z-10">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-lavender/15 border border-lavender/25 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(137,96,246,0.25)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#8960F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="font-heading text-5xl font-bold text-white mb-4 tracking-wider drop-shadow-[0_0_15px_rgba(137,96,246,0.3)]">SmartLogix</h1>
          <p className="font-share-tech text-white/50 text-base leading-relaxed uppercase tracking-wider">
            Consola central de operaciones y transacciones distribuidas en tiempo real.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-6 font-share-tech text-xs text-white/30 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              Saga Pattern
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender shadow-[0_0_8px_#8960F6]" />
              Microservicios
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-goldenrod shadow-[0_0_8px_#DAA520]" />
              React + Vite
            </span>
          </div>
        </div>
      </div>

      {/* Panel derecho — Formulario de Acceso */}
      <div className="relative flex items-center justify-center w-full lg:w-[480px] xl:w-[520px] shrink-0 px-6 z-10">
        <div className="w-full max-w-sm">
          {/* Logo móvil para pantallas pequeñas */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-lavender/20 border border-lavender/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(137,96,246,0.2)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8960F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h2 className="font-heading text-3xl font-bold text-white tracking-wide">SmartLogix</h2>
          </div>

          <div className="bg-[#170E30]/75 rounded-2xl shadow-[0_0_50px_rgba(28,7,59,0.6)] border border-lavender/20 p-8 backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wider">
                {isRegister ? 'Nueva Inscripción' : 'Iniciar Sesión'}
              </h2>
              <p className="font-share-tech text-xs text-white/40 mt-1.5 uppercase tracking-widest">
                {isRegister ? 'Registra tu firma para entrar al reino' : 'Ingresa tus credenciales criptográficas'}
              </p>
            </div>

            {success && (
              <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-share-tech uppercase tracking-wider text-center flex items-center gap-2 justify-center shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 p-3.5 bg-tomato/10 border border-tomato/25 text-tomato rounded-xl text-xs font-share-tech uppercase tracking-wider text-center shadow-[0_0_15px_rgba(255,99,71,0.1)]">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-heading uppercase tracking-widest text-white/50 mb-2">Usuario</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#170E30]/50 border border-lavender/20 rounded-xl text-sm text-white placeholder-white/20 font-share-tech focus:outline-none focus:ring-2 focus:ring-lavender/30 focus:border-lavender/50 transition-all duration-300"
                  placeholder="tu_firma"
                />
              </div>

              <div>
                <label className="block text-xs font-heading uppercase tracking-widest text-white/50 mb-2">Contraseña</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#170E30]/50 border border-lavender/20 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lavender/30 focus:border-lavender/50 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                loading={loading}
                className="w-full shadow-lg shadow-lavender/20 bg-lavender hover:bg-lavender/90 font-heading uppercase tracking-widest text-sm py-3"
              >
                {loading ? 'Procesando...' : isRegister ? 'Confirmar Cuenta' : 'Entrar al Panel'}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-lavender/10 pt-5">
              <button 
                type="button"
                onClick={onToggle}
                className="font-share-tech text-xs text-lavender hover:text-goldenrod uppercase tracking-widest transition-colors duration-200"
              >
                {isRegister ? '¿Ya estás registrado? Inicia sesión' : '¿Nuevo en el reino? Crea una cuenta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}