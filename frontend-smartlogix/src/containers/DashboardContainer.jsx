import { useState, useEffect } from "react";
import DashboardView from "../components/DashboardView";

// Simulated API facade call — replace with your BFF facade layer
async function fetchDashboardData() {
  await new Promise((r) => setTimeout(r, 900));
  return {
    kpis: [
      {
        id: "orders",
        label: "Pedidos Hoy",
        value: "1,284",
        delta: "+12%",
        trend: "up",
        icon: "🛒",
        color: "blue",
      },
      {
        id: "revenue",
        label: "Ingresos del Día",
        value: "$48,320",
        delta: "+8.4%",
        trend: "up",
        icon: "💰",
        color: "emerald",
      },
      {
        id: "stock",
        label: "Alertas de Stock",
        value: "7",
        delta: "-2 vs ayer",
        trend: "down",
        icon: "📦",
        color: "amber",
      },
      {
        id: "shipments",
        label: "Envíos en Tránsito",
        value: "342",
        delta: "+5%",
        trend: "up",
        icon: "🚚",
        color: "violet",
      },
    ],
    recentOrders: [
      {
        id: "ORD-9021",
        client: "Distribuidora Norte",
        items: 14,
        total: "$2,450",
        status: "CONFIRMED",
        time: "Hace 3 min",
      },
      {
        id: "ORD-9020",
        client: "Mercados del Sur S.A.",
        items: 6,
        total: "$890",
        status: "PENDING",
        time: "Hace 11 min",
      },
      {
        id: "ORD-9019",
        client: "LogiCorp Chile",
        items: 22,
        total: "$5,120",
        status: "CONFIRMED",
        time: "Hace 28 min",
      },
      {
        id: "ORD-9018",
        client: "Retail Express",
        items: 3,
        total: "$210",
        status: "CANCELLED",
        time: "Hace 45 min",
      },
      {
        id: "ORD-9017",
        client: "Grupo Andino",
        items: 9,
        total: "$1,670",
        status: "PENDING",
        time: "Hace 1 h",
      },
    ],
    stockAlerts: [
      { sku: "SKU-4412", name: "Caja Cartón 50x40", stock: 3, min: 20, warehouse: "Bodega A" },
      { sku: "SKU-2201", name: "Pallet Madera Std", stock: 7, min: 15, warehouse: "Bodega B" },
      { sku: "SKU-8834", name: "Film Stretch 500m", stock: 1, min: 10, warehouse: "Bodega A" },
    ],
    activityFeed: [
      { id: 1, type: "order", msg: "Pedido ORD-9021 confirmado por Saga", time: "03:14" },
      { id: 2, type: "stock", msg: "Stock crítico en SKU-8834 detectado", time: "03:02" },
      { id: 3, type: "ship", msg: "Envío SHP-441 despachado desde Bodega A", time: "02:50" },
      { id: 4, type: "order", msg: "Pedido ORD-9018 compensado (CANCELLED)", time: "02:31" },
      { id: 5, type: "user", msg: "Admin actualizó tarifas de envío zona sur", time: "02:10" },
    ],
  };
}

export default function DashboardContainer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection] = useState("Dashboard");

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(() => setError("No se pudo cargar el dashboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardView
      loading={loading}
      error={error}
      data={data}
      activeSection={activeSection}
    />
  );
}
