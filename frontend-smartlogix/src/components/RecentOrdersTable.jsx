import React from 'react';

const STATUS_STYLES = {
  CONFIRMED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendiente",
  CANCELLED: "Cancelado",
};

function SagaBadge({ status }) {
  // Aseguramos que el status esté en mayúsculas para que haga match con tu DB
  const safeStatus = status?.toUpperCase() || "PENDING";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        STATUS_STYLES[safeStatus] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUS_LABELS[safeStatus] ?? safeStatus}
    </span>
  );
}

export default function RecentOrdersTable({ 
  pedidos, // Cambiado de 'orders' a 'pedidos'
  loading,
  filtroEstado,
  setFiltroEstado,
  busquedaId,
  setBusquedaId,
  onVerDetalle 
}) {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      
      {/* 🔍 Controles de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por ID..."
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="CONFIRMED">Confirmado (Éxito)</option>
          <option value="PENDING">Pendiente (Procesando)</option>
          <option value="CANCELLED">Cancelado (Fallo Saga)</option>
        </select>
      </div>

      {/* 📊 Contenedor de la Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Cargando datos desde el Gateway...</p>
        ) : !pedidos || pedidos.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No se encontraron pedidos con esos filtros.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Pedido ID", "Cliente", "Estado Saga", "Acción"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidos.map((pedido) => (
                <tr
                  key={pedido.id}
                  // 🚀 AQUÍ ESTÁ LA MAGIA: Al hacer clic, abre el modal
                  onClick={() => onVerDetalle(pedido.id)}
                  className="hover:bg-blue-50 transition-colors duration-100 cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-mono font-semibold text-gray-700 text-xs">
                    #{pedido.id}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">
                    {pedido.clienteId || pedido.client || "Cliente Local"}
                  </td>
                  <td className="px-5 py-3.5">
                    {/* Le pasamos sagaStatus, pero con fallback por si tu DB lo llama de otra forma */}
                    <SagaBadge status={pedido.sagaStatus || pedido.estado || pedido.status} />
                  </td>
                  <td className="px-5 py-3.5 text-blue-600 hover:text-blue-800 text-xs font-medium">
                    Ver Detalle &rarr;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}