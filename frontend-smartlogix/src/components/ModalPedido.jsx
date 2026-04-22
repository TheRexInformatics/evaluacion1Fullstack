/**
 * ModalPedido.jsx — Presenter puro
 * No tiene useState ni fetch. Todo llega por props.
 */

function InputField({ label, id, error, children }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

export default function ModalPedido({ mode, form, formErrors, saving, onClose, onChange, onSubmit }) {
  if (!mode) return null;

  const isEdit   = mode === "edit";
  const title    = isEdit ? "Editar Pedido" : "Nuevo Pedido";
  const btnLabel = saving ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Pedido";

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? "Modifica los datos del pedido" : "Completa los datos para registrar un nuevo pedido"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <InputField label="Cliente" id="client" error={formErrors.client}>
            <input
              id="client"
              type="text"
              value={form.client}
              onChange={(e) => onChange("client", e.target.value)}
              placeholder="Ej: Distribuidora Norte"
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 transition ${
                formErrors.client ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
              }`}
            />
          </InputField>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Cantidad de Ítems" id="items" error={formErrors.items}>
              <input
                id="items"
                type="number"
                min="1"
                value={form.items}
                onChange={(e) => onChange("items", e.target.value)}
                placeholder="0"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 transition ${
                  formErrors.items ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                }`}
              />
            </InputField>

            <InputField label="Total ($)" id="total" error={formErrors.total}>
              <input
                id="total"
                type="number"
                min="0"
                step="0.01"
                value={form.total}
                onChange={(e) => onChange("total", e.target.value)}
                placeholder="0.00"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 transition ${
                  formErrors.total ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
                }`}
              />
            </InputField>
          </div>

          <InputField label="Fecha del Pedido" id="fecha" error={formErrors.fecha}>
            <input
              id="fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => onChange("fecha", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 transition ${
                formErrors.fecha ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
              }`}
            />
          </InputField>

          {isEdit && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              ℹ️ El estado del pedido se gestiona desde las acciones de la tabla.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
