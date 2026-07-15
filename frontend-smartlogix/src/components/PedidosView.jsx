import FiltrosPedidos      from "./FiltrosPedidos";
import ModalPedido         from "./ModalPedido";
import ModalDetallePedido  from "./ModalDetallePedido";
import ConfirmDialog       from "./ConfirmDialog";
import Button              from "./ui/Button";
import { formatCurrency }  from "../facade/BffFacade";

const STATUS_STYLES = {
  CONFIRMED: "bg-emerald-500/15 text-emerald-400",
  PENDING:   "bg-goldenrod/15 text-goldenrod",
  CANCELLED: "bg-tomato/15 text-tomato",
};
const STATUS_LABELS = { CONFIRMED: "Confirmado", PENDING: "Pendiente", CANCELLED: "Cancelado" };

function SagaBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-white/5 text-white/50"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j} className="px-5 py-4"><div className="h-3.5 bg-white/5 rounded" /></td>
      ))}
    </tr>
  ));
}

function TablaPedidos({ pedidos, loading, onVerDetalle, onEdit, onCancel }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-lavender/10">
            {["Pedido", "Cliente / ID", "Ítems", "Total", "Fecha", "Estado Saga", "Acciones"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? <SkeletonRows /> : pedidos.length === 0 ? (
            <tr><td colSpan={7} className="px-5 py-12 text-center text-white/40 text-sm">No se encontraron pedidos con los filtros aplicados.</td></tr>
          ) : pedidos.map((p) => {
            const clientLabel   = p.clienteId ?? p.client ?? "—";
            const statusKey     = p.sagaStatus ?? p.status;
            const isCancellable = statusKey === "PENDING" || statusKey === "CONFIRMED";
            const isEditable    = statusKey !== "CANCELLED";
            return (
              <tr key={p.id} className="hover:bg-lavender/5 transition-colors duration-100 cursor-pointer" onClick={() => onVerDetalle(p)}>
                <td className="px-5 py-3.5 font-share-tech font-semibold text-lavender text-xs">{p.id}</td>
                <td className="px-5 py-3.5 text-white/70 font-medium max-w-[160px] truncate">{clientLabel}</td>
                <td className="px-5 py-3.5 text-white/50">{p.items}</td>
                <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(p.total ?? 0)}</td>
                <td className="px-5 py-3.5 text-white/50 whitespace-nowrap">{p.fecha}</td>
                <td className="px-5 py-3.5"><SagaBadge status={statusKey} /></td>
                <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(p)} disabled={!isEditable}
                      className="text-lavender">
                      Editar
                    </Button>
                    <span className="text-white/10">|</span>
                    <Button size="sm" variant="ghost" onClick={() => onCancel(p.id)} disabled={!isCancellable}
                      className="text-tomato">
                      Cancelar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PedidosView({
  pedidos, loading, saving, error,
  filterStatus, filterFechaDesde, filterFechaHasta,
  onFilterStatus, onFilterFechaDesde, onFilterFechaHasta,
  searchClienteId, onSearchClienteId,
  modalMode, form, formErrors,
  onOpenCreate, onOpenEdit, onCloseModal, onFormChange, onSubmit,
  showDetalle, detallePedido, loadingDetalle, onOpenDetalle, onCloseDetalle,
  confirmCancelId, onAskCancel, onConfirmCancel, onDismissCancel,
}) {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8 max-w-screen-2xl mx-auto w-full">
      {error && (
        <div className="bg-tomato/10 border border-tomato/20 text-tomato rounded-xl p-4 text-sm">⚠️ {error}</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-lg font-bold text-white">Gestión de Pedidos</h2>
          <p className="text-xs text-white/40 mt-0.5">
            {loading ? "Cargando..." : `${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""} encontrado${pedidos.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={onOpenCreate}>
          <span className="text-base leading-none">+</span> Nuevo Pedido
        </Button>
      </div>

      <div className="bg-night-purple rounded-xl shadow-lg border border-lavender/10">
        <FiltrosPedidos
          filterStatus={filterStatus} filterFechaDesde={filterFechaDesde} filterFechaHasta={filterFechaHasta}
          onFilterStatus={onFilterStatus} onFilterFechaDesde={onFilterFechaDesde} onFilterFechaHasta={onFilterFechaHasta}
        />

        <div className="px-5 py-3 border-b border-lavender/10">
          <div className="flex items-center gap-2 bg-white/5 border border-lavender/15 rounded-lg px-3 py-2 max-w-sm">
            <span className="text-white/30 text-sm">🔍</span>
            <input type="text" value={searchClienteId} onChange={(e) => onSearchClienteId(e.target.value)}
              placeholder="Buscar por cliente o ID de pedido..."
              className="bg-transparent text-sm text-white placeholder-white/25 outline-none flex-1" />
            {searchClienteId && (
              <button onClick={() => onSearchClienteId("")} className="text-white/30 hover:text-tomato transition-colors">✕</button>
            )}
          </div>
        </div>

        <TablaPedidos pedidos={pedidos} loading={loading}
          onVerDetalle={onOpenDetalle} onEdit={onOpenEdit} onCancel={onAskCancel} />
      </div>

      <ModalPedido mode={modalMode} form={form} formErrors={formErrors} saving={saving}
        onClose={onCloseModal} onChange={onFormChange} onSubmit={onSubmit} />

      {showDetalle && (
        <ModalDetallePedido pedido={detallePedido} loadingDetalle={loadingDetalle}
          onClose={onCloseDetalle} onEdit={onOpenEdit} onCancel={onAskCancel} />
      )}

      <ConfirmDialog show={!!confirmCancelId} title="Cancelar Pedido"
        message={`¿Estás seguro de cancelar el pedido ${confirmCancelId}? Esta acción iniciará la compensación Saga y no se puede deshacer.`}
        confirmLabel="Sí, cancelar pedido" saving={saving}
        onConfirm={onConfirmCancel} onDismiss={onDismissCancel} />
    </main>
  );
}
