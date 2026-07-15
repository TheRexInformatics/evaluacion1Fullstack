import NotificationDropdown from './NotificationDropdown';
import CartDropdown from './CartDropdown';
import ConfirmDialog from './ConfirmDialog';
import Button from './ui/Button';
import { useState } from 'react';

export default function Header({ section, userName = "Admin", onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const now = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      <header className="bg-night-purple border-b border-lavender/10 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-sans text-white font-semibold text-lg leading-tight">{section}</h1>
          <p className="text-white/40 text-xs capitalize">{now}</p>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <CartDropdown userName={userName} />

          <div className="flex items-center gap-3 pl-3 border-l border-lavender/10">
            <div className="w-8 h-8 rounded-full bg-lavender/20 border border-lavender/30 flex items-center justify-center text-lavender text-xs font-bold shrink-0">
              {initials || "AD"}
            </div>
            <span className="hidden md:block text-sm font-medium text-white/70 max-w-[140px] truncate">
              {userName}
            </span>
            <Button variant="ghost" size="sm"
              onClick={() => setShowLogoutConfirm(true)}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="ml-1 p-1.5 rounded-lg text-white/30 hover:bg-tomato/15 hover:text-tomato"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <ConfirmDialog
        show={showLogoutConfirm}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres salir?"
        confirmLabel="Salir"
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        onDismiss={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
