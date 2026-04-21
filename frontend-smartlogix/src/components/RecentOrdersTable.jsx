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
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function RecentOrdersTable({ orders }) {
  if (!orders.length) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">
        No hay pedidos recientes.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Pedido", "Cliente", "Ítems", "Total", "Estado Saga", "Hora"].map((h) => (
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
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
            >
              <td className="px-5 py-3.5 font-mono font-semibold text-gray-700 text-xs">
                {order.id}
              </td>
              <td className="px-5 py-3.5 text-gray-700 font-medium">{order.client}</td>
              <td className="px-5 py-3.5 text-gray-500">{order.items}</td>
              <td className="px-5 py-3.5 text-gray-800 font-semibold">{order.total}</td>
              <td className="px-5 py-3.5">
                <SagaBadge status={order.status} />
              </td>
              <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                {order.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
