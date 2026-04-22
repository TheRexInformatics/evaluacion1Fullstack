import { useState, useEffect, useCallback } from "react";
import { getPedidos, createPedido, updatePedido, cancelPedido } from "../facade/pedidosFacade";
import PedidosView from "../components/PedidosView";

const EMPTY_FORM = { client: "", items: "", total: "", fecha: "" };

export default function PedidosContainer() {
  // ── Data ────────────────────────────────────────────────────────────────
  const [pedidos, setPedidos]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState(null);

  // ── Filters ─────────────────────────────────────────────────────────────
  const [filterStatus,     setFilterStatus]     = useState("ALL");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");

  // ── Modal ───────────────────────────────────────────────────────────────
  const [modalMode,    setModalMode]    = useState(null);   // "create" | "edit" | null
  const [selectedId,   setSelectedId]   = useState(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formErrors,   setFormErrors]   = useState({});

  // ── Confirm cancel dialog ────────────────────────────────────────────────
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  // ── Load / reload ────────────────────────────────────────────────────────
  const loadPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPedidos({
        status:     filterStatus,
        fechaDesde: filterFechaDesde,
        fechaHasta: filterFechaHasta,
      });
      setPedidos(data);
    } catch {
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterFechaDesde, filterFechaHasta]);

  useEffect(() => { loadPedidos(); }, [loadPedidos]);

  // ── Form helpers ─────────────────────────────────────────────────────────
  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateForm() {
    const errs = {};
    if (!form.client.trim())      errs.client = "El cliente es requerido.";
    if (!form.fecha)              errs.fecha  = "La fecha es requerida.";
    if (!form.items || isNaN(Number(form.items)) || Number(form.items) < 1)
      errs.items = "Debe ser un número mayor a 0.";
    if (!form.total || isNaN(Number(form.total)) || Number(form.total) < 0)
      errs.total = "Debe ser un monto válido.";
    return errs;
  }

  // ── Open modals ──────────────────────────────────────────────────────────
  function handleOpenCreate() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSelectedId(null);
    setModalMode("create");
  }

  function handleOpenEdit(pedido) {
    setForm({
      client: pedido.client,
      items:  String(pedido.items),
      total:  String(pedido.total),
      fecha:  pedido.fecha,
    });
    setFormErrors({});
    setSelectedId(pedido.id);
    setModalMode("edit");
  }

  function handleCloseModal() {
    setModalMode(null);
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        client: form.client.trim(),
        items:  Number(form.items),
        total:  Number(form.total),
        fecha:  form.fecha,
      };

      if (modalMode === "create") {
        await createPedido(payload);
      } else {
        await updatePedido(selectedId, payload);
      }

      handleCloseModal();
      await loadPedidos();
    } catch {
      setError("Error al guardar el pedido.");
    } finally {
      setSaving(false);
    }
  }

  // ── Cancel (Saga) ────────────────────────────────────────────────────────
  function handleAskCancel(id) {
    setConfirmCancelId(id);
  }

  async function handleConfirmCancel() {
    if (!confirmCancelId) return;
    setSaving(true);
    try {
      await cancelPedido(confirmCancelId);
      await loadPedidos();
    } catch {
      setError("Error al cancelar el pedido.");
    } finally {
      setSaving(false);
      setConfirmCancelId(null);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <PedidosView
      // data
      pedidos={pedidos}
      loading={loading}
      saving={saving}
      error={error}
      // filters
      filterStatus={filterStatus}
      filterFechaDesde={filterFechaDesde}
      filterFechaHasta={filterFechaHasta}
      onFilterStatus={setFilterStatus}
      onFilterFechaDesde={setFilterFechaDesde}
      onFilterFechaHasta={setFilterFechaHasta}
      // modal
      modalMode={modalMode}
      form={form}
      formErrors={formErrors}
      onOpenCreate={handleOpenCreate}
      onOpenEdit={handleOpenEdit}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      // cancel confirm
      confirmCancelId={confirmCancelId}
      onAskCancel={handleAskCancel}
      onConfirmCancel={handleConfirmCancel}
      onDismissCancel={() => setConfirmCancelId(null)}
    />
  );
}
