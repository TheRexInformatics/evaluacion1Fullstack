import { useState, useEffect } from "react";
import { isAuthenticated, isTokenExpired, logout, decodeTokenPayload } from "./facade/BffFacade";

// Containers
import LoginContainer     from "./containers/LoginContainer";
import DashboardContainer from "./containers/DashboardContainer";
import PedidosContainer   from "./containers/PedidosContainer";

// Presenters de layout
import Sidebar from "./components/Sidebar";
import Header  from "./components/Header";

/* ── Placeholder para módulos no implementados aún ─────────────────────── */
function PlaceholderSection({ section }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-4xl">🚧</p>
        <p className="text-gray-400 text-sm">
          Módulo <span className="font-semibold text-gray-600">{section}</span> — próximamente
        </p>
      </div>
    </div>
  );
}

/* ── Verificación del token ─────────────────────────────────────────────── */
function checkAuth() {
  return isAuthenticated() && !isTokenExpired();
}

/* ── App root ───────────────────────────────────────────────────────────── */
export default function App() {
  const [authenticated,  setAuthenticated]  = useState(checkAuth);
  const [activeSection,  setActiveSection]  = useState("Dashboard");

  // Leer nombre del usuario desde el payload del JWT
  const tokenPayload = authenticated ? decodeTokenPayload() : null;
  const userName     = tokenPayload?.name ?? tokenPayload?.sub ?? "Admin";

  // Escucha el evento global que dispara BffFacade cuando recibe un 401
  useEffect(() => {
    function handleUnauthorized() {
      setAuthenticated(false);
    }
    window.addEventListener("smartlogix:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("smartlogix:unauthorized", handleUnauthorized);
  }, []);

  // Verificación periódica de expiración del token (cada 60 s)
  useEffect(() => {
    if (!authenticated) return;
    const id = setInterval(() => {
      if (isTokenExpired()) {
        logout();
        setAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [authenticated]);

  /* ── Login ─────────────────────────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <LoginContainer
        onLoginSuccess={() => {
          setAuthenticated(true);
          setActiveSection("Dashboard");
        }}
      />
    );
  }

  /* ── Layout principal (autenticado) ─────────────────────────────────────── */
  function handleLogout() {
    logout();
    setAuthenticated(false);
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
        {activeSection === "Inventario" && <PlaceholderSection section="Inventario" />}
        {activeSection === "Envíos"     && <PlaceholderSection section="Envíos" />}
      </div>
    </div>
  );
}
