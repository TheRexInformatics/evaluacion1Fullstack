import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const STATUS_STYLES = {
  CONFIRMED: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  PENDING: "bg-goldenrod/15 text-goldenrod border border-goldenrod/20",
  CANCELLED: "bg-tomato/15 text-tomato border border-tomato/20",
  PROCESADO: "bg-lavender/15 text-lavender border border-lavender/20",
  COMPLETADO: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
};

const STATUS_LABELS = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendiente",
  CANCELLED: "Cancelado",
  PROCESADO: "Procesado",
  COMPLETADO: "Completado",
};

function SagaBadge({ status }) {
  const safeStatus = (status || "PROCESADO").toUpperCase();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[safeStatus] ?? "bg-white/5 text-white/50 border border-white/10"}`}>
      {STATUS_LABELS[safeStatus] ?? safeStatus}
    </span>
  );
}

export default function RecentOrdersTable({ 
  pedidos,
  loading,
  filtroEstado,
  setFiltroEstado,
  busquedaId,
  setBusquedaId,
  onVerDetalle,
  onCancelar,
  onCompletar,
}) {
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-lavender border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-white/40 text-sm">Cargando pedidos...</p>
      </div>
    );
  }

  if (!pedidos || pedidos.length === 0) {
    return (
      <div className="p-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white/20">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="text-white/40 text-sm">No se encontraron pedidos con esos filtros.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/[0.02] p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            className="w-full sm:w-56 pl-9 pr-4 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40"
          />
        </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-lavender/15 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 bg-white/5"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PROCESADO">Procesado</option>
            <option value="COMPLETADO">Completado</option>
            <option value="PENDING">Pendiente</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Pedido ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pedidos.map((pedido) => {
                const badgeStatus = pedido.estado || pedido.sagaStatus || pedido.status;
                const isActive = badgeStatus === 'PROCESADO' && pedido.sagaStatus !== 'CANCELLED';
                const isCompleted = badgeStatus === 'COMPLETADO';
                const isCancelled = badgeStatus === 'CANCELLED';

                return (
                  <tr key={pedido.id} className="hover:bg-lavender/5 transition-colors duration-100">
                    <td
                      onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                      className="px-5 py-3.5 font-share-tech font-semibold text-lavender text-xs cursor-pointer">
                      #{pedido.id}
                    </td>
                    <td
                      onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                      className="px-5 py-3.5 text-white/70 font-medium cursor-pointer">
                      {pedido.clienteId || pedido.client || "Cliente Local"}
                    </td>
                    <td
                      onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                      className="px-5 py-3.5 cursor-pointer">
                      <SagaBadge status={badgeStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {isActive && onCompletar && (
                          <button onClick={() => onCompletar(pedido.id)}
                            className="text-xs px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 font-medium transition-colors">
                            Completar
                          </button>
                        )}
                        {isActive && onCancelar && (
                          <button onClick={() => setCancelConfirmId(pedido.id)}
                            className="text-xs px-2.5 py-1.5 bg-tomato/10 text-tomato rounded-lg hover:bg-tomato/20 font-medium transition-colors">
                            Cancelar
                          </button>
                        )}
                        {isCompleted && (
                          <span className="text-xs text-emerald-400 font-medium">✓ Completado</span>
                        )}
                        {isCancelled && (
                          <span className="text-xs text-tomato/50 font-medium">Cancelado</span>
                        )}
                        <button
                          onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                          className="text-xs text-lavender/80 hover:text-lavender font-medium">
                          Ver Detalle →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        show={!!cancelConfirmId}
        title={`Cancelar Pedido #${cancelConfirmId}`}
        message="Se cancelará el pedido y se restaurará el stock."
        confirmLabel="Cancelar Pedido"
        onConfirm={() => { onCancelar(cancelConfirmId); setCancelConfirmId(null); }}
        onDismiss={() => setCancelConfirmId(null)}
      />
    </>
  );
}
