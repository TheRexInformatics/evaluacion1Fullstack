import { useState, useEffect } from "react";
import { isAuthenticated as checkAuthFacade, isTokenExpired, logout, decodeTokenPayload } from "./facade/BffFacade";

// Containers
import LoginContainer     from "./containers/LoginContainer";
import DashboardContainer from "./containers/DashboardContainer";
import PedidosContainer   from "./containers/PedidosContainer";
import InventarioContainer from "./containers/InventarioContainer";
import EnviosContainer     from "./containers/EnviosContainer";

// Presenters de layout
import Sidebar from "./components/Sidebar";
import Header  from "./components/Header";

/* ── Placeholder para módulos no implementados aún ─────────────────────── */
function PlaceholderSection({ section }) {
  const icons = {
    Inventario: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-slate-300">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    "Envíos": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-slate-300">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  };
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {icons[section] || (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-slate-300">
              <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          )}
        </div>
        <p className="text-slate-400 text-sm">
          <span className="font-semibold text-slate-500">{section}</span> — próximamente
        </p>
      </div>
    </div>
  );
}

/* ── App root ───────────────────────────────────────────────────────────── */
export default function App() {
  // Corregido: usamos sistemáticamente isAuthenticated y setIsAuthenticated
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('smartlogix_token'));
  const [activeSection, setActiveSection] = useState("Dashboard");

  // Leer nombre del usuario desde el payload del JWT
  const tokenPayload = isAuthenticated ? decodeTokenPayload() : null;
  const userName     = tokenPayload?.name ?? tokenPayload?.sub ?? "Admin";

  // Escucha el evento global que dispara BffFacade cuando recibe un 401
  useEffect(() => {
    function handleUnauthorized() {
      setIsAuthenticated(false);
    }
    window.addEventListener("smartlogix:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("smartlogix:unauthorized", handleUnauthorized);
  }, []);

  // Verificación periódica de expiración del token (cada 60 s)
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => {
      if (isTokenExpired()) {
        logout();
        setIsAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  /* ── Login ─────────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <LoginContainer
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setActiveSection("Dashboard");
        }}
      />
    );
  }

  /* ── Layout principal (autenticado) ─────────────────────────────────────── */
  function handleLogout() {
    logout();
    setIsAuthenticated(false);
  }

  return (
    <div
      className="flex h-screen bg-gray-50 overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          section={activeSection}
          userName={userName}
          onLogout={handleLogout}
        />

        {/* Rutas protegidas */}
        {activeSection === "Dashboard"  && <DashboardContainer />}
        {activeSection === "Pedidos"    && <PedidosContainer />}
        {activeSection === "Inventario" && <InventarioContainer />}
        {activeSection === "Envíos"     && <EnviosContainer />}
      </div>
    </div>
  );
}