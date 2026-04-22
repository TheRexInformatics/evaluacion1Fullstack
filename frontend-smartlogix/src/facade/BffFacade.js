// src/facade/BffFacade.js

// En el futuro, esta será la URL de tu API Gateway (puerto 8080)
const API_URL = 'http://localhost:8080/api/v1';

export const bffFacade = {
  
  // Método para obtener los datos del Dashboard
  getDashboardData: async () => {
    try {
      /* =========================================================
         CÓDIGO FUTURO (Para cuando el Backend Spring Boot esté listo):
         const response = await fetch(`${API_URL}/dashboard`);
         if (!response.ok) throw new Error('Error al conectar con el BFF');
         return await response.json();
      ========================================================= */

      // CÓDIGO ACTUAL (Simulación para no bloquear el desarrollo Frontend):
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            kpis: [
              { id: "orders", label: "Pedidos Hoy", value: "1,284", delta: "+12%", trend: "up", icon: "🛒", color: "blue" },
              { id: "revenue", label: "Ingresos del Día", value: "$48,320", delta: "+8.4%", trend: "up", icon: "💰", color: "emerald" },
              { id: "stock", label: "Alertas de Stock", value: "7", delta: "-2 vs ayer", trend: "down", icon: "📦", color: "amber" },
              { id: "shipments", label: "Envíos en Tránsito", value: "342", delta: "+5%", trend: "up", icon: "🚚", color: "violet" },
            ],
            recentOrders: [
              { id: "ORD-9021", client: "Distribuidora Norte", items: 14, total: "$2,450", status: "CONFIRMED", time: "Hace 3 min" },
              { id: "ORD-9020", client: "Mercados del Sur S.A.", items: 6, total: "$890", status: "PENDING", time: "Hace 11 min" },
              { id: "ORD-9019", client: "Insumos Médicos", items: 120, total: "$12,400", status: "CANCELLED", time: "Hace 45 min" },
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
            ]
          });
        }, 900); // Simulamos 900ms de latencia de red
      });

    } catch (error) {
      console.error("BffFacade Error:", error);
      throw error;
    }
  },

  // Aquí agregaremos en el futuro los métodos de compensación de la Saga:
  // forzarReintentoSaga: async (pedidoId) => { ... },
  // cancelarPedidoSaga: async (pedidoId) => { ... }
};