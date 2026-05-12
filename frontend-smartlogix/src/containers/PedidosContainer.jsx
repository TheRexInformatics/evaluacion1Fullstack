import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  cancelPedido,
} from "../facade/BffFacade";
import PedidosView from "../components/PedidosView";

const EMPTY_FORM = { client: "", items: "", total: "", fecha: "" };

export default function PedidosContainer() {
  // ── Data ─────────────────────────────────────────────────────────────────
  const [pedidos,  setPedidos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);

  // ── Filtros servidor (sagaStatus + fechas) ────────────────────────────────
  const [filterStatus,     setFilterStatus]     = useState("ALL");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");

  // ── Filtro local por clienteId / ID de pedido ─────────────────────────────
  const [searchClienteId, setSearchClienteId] = useState("");

  // ── Modal CRUD ────────────────────────────────────────────────────────────
  const [modalMode,  setModalMode]  = useState(null); // "create" | "edit"
  const [selectedId, setSelectedId] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ── Modal DETALLE ─────────────────────────────────────────────────────────
  const [detallePedido,  setDetallePedido]  = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [showDetalle,    setShowDetalle]    = useState(false);

  // ── Confirm cancel ────────────────────────────────────────────────────────
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  // ── Carga desde servidor ──────────────────────────────────────────────────
  const loadPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPedidos({
        sagaStatus: filterStatus,
        fechaDesde: filterFechaDesde,
        fechaHasta: filterFechaHasta,
      });
      setPedidos(data);
    } catch (err) {
      setError(err.message ?? "No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterFechaDesde, filterFechaHasta]);

  useEffect(() => { loadPedidos(); }, [loadPedidos]);

  // ── Filtro local por clienteId (sin round-trip al servidor) ──────────────
  const pedidosFiltrados = useMemo(() => {
    if (!searchClienteId.trim()) return pedidos;
    const q = searchClienteId.trim().toLowerCase();
    return pedidos.filter(
      (p) =>
        (p.clienteId ?? p.client ?? "").toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [pedidos, searchClienteId]);

  // ── Form helpers ──────────────────────────────────────────────────────────
  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateForm() {
    const e = {};
    if (!form.client.trim())                                         e.client = "El cliente es requerido.";
    if (!form.fecha)                                                 e.fecha  = "La fecha es requerida.";
    if (!form.items || isNaN(+form.items) || +form.items < 1)       e.items  = "Debe ser un número mayor a 0.";
    if (form.total === "" || isNaN(+form.total) || +form.total < 0) e.total  = "Debe ser un monto válido.";
    return e;
  }

  // ── Abrir modal CRUD ──────────────────────────────────────────────────────
  function handleOpenCreate() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSelectedId(null);
    setModalMode("create");
  }

  function handleOpenEdit(pedido) {
    setForm({
      client: pedido.clienteId ?? pedido.client ?? "",
      items:  String(pedido.items),
      total:  String(pedido.total),
      fecha:  pedido.fecha,
    });
    setFormErrors({});
    setSelectedId(pedido.id);
    setModalMode("edit");
    setShowDetalle(false);
  }

  function handleCloseModal() {
    setModalMode(null);
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  // ── Submit CRUD ───────────────────────────────────────────────────────────
  async function handleSubmit() {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        clienteId: form.client.trim(),
        items:     +form.items,
        total:     +form.total,
        fecha:     form.fecha,
      };
      if (modalMode === "create") await createPedido(payload);
      else                        await updatePedido(selectedId, payload);

      handleCloseModal();
      await loadPedidos();
    } catch (err) {
      setError(err.message ?? "Error al guardar el pedido.");
    } finally {
      setSaving(false);
    }
  }

  // ── Modal DETALLE — carga datos completos incluyendo motivoFallo ──────────
  async function handleOpenDetalle(pedido) {
    setDetallePedido(pedido);    // datos básicos de inmediato
    setLoadingDetalle(true);
    setShowDetalle(true);
    try {
      const completo = await getPedidoById(pedido.id);
      setDetallePedido(completo);
    } catch {
      // mantiene los datos básicos si el detalle falla
    } finally {
      setLoadingDetalle(false);
    }
  }

  function handleCloseDetalle() {
    setShowDetalle(false);
    setDetallePedido(null);
  }

  // ── Cancel (Saga compensation) ────────────────────────────────────────────
  function handleAskCancel(id) {
    setConfirmCancelId(id);
    setShowDetalle(false);
  }

  async function handleConfirmCancel() {
    if (!confirmCancelId) return;
    setSaving(true);
    try {
      await cancelPedido(confirmCancelId);
      await loadPedidos();
    } catch (err) {
      setError(err.message ?? "Error al cancelar el pedido.");
    } finally {
      setSaving(false);
      setConfirmCancelId(null);
    }
  }

  return (
    <PedidosView
      pedidos={pedidosFiltrados}
      loading={loading}
      saving={saving}
      error={error}
      filterStatus={filterStatus}
      filterFechaDesde={filterFechaDesde}
      filterFechaHasta={filterFechaHasta}
      onFilterStatus={setFilterStatus}
      onFilterFechaDesde={setFilterFechaDesde}
      onFilterFechaHasta={setFilterFechaHasta}
      searchClienteId={searchClienteId}
      onSearchClienteId={setSearchClienteId}
      modalMode={modalMode}
      form={form}
      formErrors={formErrors}
      onOpenCreate={handleOpenCreate}
      onOpenEdit={handleOpenEdit}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      showDetalle={showDetalle}
      detallePedido={detallePedido}
      loadingDetalle={loadingDetalle}
      onOpenDetalle={handleOpenDetalle}
      onCloseDetalle={handleCloseDetalle}
      confirmCancelId={confirmCancelId}
      onAskCancel={handleAskCancel}
      onConfirmCancel={handleConfirmCancel}
      onDismissCancel={() => setConfirmCancelId(null)}
    />
  );
}
