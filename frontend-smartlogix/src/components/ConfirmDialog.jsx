/**
 * ConfirmDialog.jsx — Presenter puro
 * Dialog de confirmación genérico. Usado para la compensación Saga de cancelación.
 */
export default function ConfirmDialog({ show, title, message, confirmLabel, saving, onConfirm, onDismiss }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.25)] w-full max-w-sm mx-4 overflow-clip">
        <div className="px-6 py-5 space-y-2">
          <div className="w-10 h-10 rounded-full bg-tomato/10 border border-tomato/20 flex items-center justify-center text-xl mb-3">
            ⚠️
          </div>
          <h3 className="text-base font-heading font-bold text-white">{title}</h3>
          <p className="text-sm text-white/50">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={onDismiss}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-tomato text-white hover:bg-tomato/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmLabel ?? "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
