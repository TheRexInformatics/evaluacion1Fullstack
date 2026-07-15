const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmado", badge: "bg-emerald-500/15 text-emerald-400", icon: "✅" },
  PENDING:   { label: "Pendiente",  badge: "bg-goldenrod/15 text-goldenrod", icon: "⏳" },
  CANCELLED: { label: "Cancelado",  badge: "bg-tomato/15 text-tomato", icon: "❌" },
};

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs font-semibold text-white/40 uppercase tracking-wide w-36 shrink-0">
        {label}
      </span>
      <span className={`text-sm text-white/70 text-right ${mono ? "font-share-tech" : "font-medium"}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ModalDetallePedido({ pedido, loadingDetalle, onClose, onEdit, onCancel }) {
  if (!pedido && !loadingDetalle) return null;

  const cfg = STATUS_CONFIG[pedido?.sagaStatus] ?? STATUS_CONFIG.PENDING;
  const isCancelled   = pedido?.sagaStatus === "CANCELLED";
  const isCancellable = pedido?.sagaStatus === "PENDING" || pedido?.sagaStatus === "CONFIRMED";
  const isEditable    = pedido?.sagaStatus !== "CANCELLED";

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdrop}
    >
      <div className="bg-night-purple rounded-2xl shadow-2xl border border-lavender/10 w-full max-w-lg mx-4 overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-lavender/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-lavender/10 border border-lavender/20 flex items-center justify-center text-lg">
              🛒
            </div>
            <div>
              <h2 className="font-pixelify text-base font-bold text-white">
                {loadingDetalle ? "Cargando detalle..." : `Pedido ${pedido?.id}`}
              </h2>
              <p className="text-xs text-white/40">Información completa del pedido</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:bg-white/5 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {loadingDetalle ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <div className="h-3 bg-white/5 rounded w-28" />
                  <div className="h-3 bg-white/5 rounded w-36" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 ${
                isCancelled ? "bg-tomato/10 border border-tomato/20" :
                pedido?.sagaStatus === "PENDING" ? "bg-goldenrod/10 border border-goldenrod/20" :
                "bg-emerald-500/10 border border-emerald-500/20"
              }`}>
                <span className="text-lg">{cfg.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Estado Saga</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-0.5 ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>

              <div className="space-y-0">
                <DetailRow label="ID Pedido"    value={pedido?.id}          mono />
                <DetailRow label="Cliente"      value={pedido?.clienteId ?? pedido?.client} />
                <DetailRow label="Ítems"        value={pedido?.items} />
                <DetailRow label="Total"        value={`$${Number(pedido?.total ?? 0).toLocaleString("es-CL")}`} />
                <DetailRow label="Fecha"        value={pedido?.fecha} />
                <DetailRow label="Hora"         value={pedido?.hora} />
              </div>

              {isCancelled && (
                <div className="mt-4 rounded-xl bg-tomato/10 border border-tomato/20 p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <p className="text-xs font-bold text-tomato uppercase tracking-wide">
                      Motivo del Fallo — Compensación Saga
                    </p>
                  </div>
                  <p className="text-sm text-tomato/80 leading-relaxed">
                    {pedido?.motivoFallo ?? "Sin descripción de fallo disponible."}
                  </p>
                  {pedido?.sagaStep && (
                    <p className="text-xs text-tomato/60 font-share-tech">
                      Paso fallido: {pedido.sagaStep}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {!loadingDetalle && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-lavender/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:bg-white/5 transition-colors"
            >
              Cerrar
            </button>
            <div className="flex items-center gap-2">
              {isEditable && (
                <button
                  onClick={() => onEdit(pedido)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-lavender border border-lavender/30 hover:bg-lavender/10 transition-colors"
                >
                  Editar
                </button>
              )}
              {isCancellable && (
                <button
                  onClick={() => onCancel(pedido.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-tomato text-white hover:bg-tomato/90 transition-colors"
                >
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
