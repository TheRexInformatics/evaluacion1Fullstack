import React from 'react';

export default function StockAlertsList({ alerts = [] }) {
  // Escenario 1: No hay alertas (Stock saludable)
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-full">
        <span className="text-3xl mb-3">✅</span>
        <h4 className="text-sm font-semibold text-gray-700">Inventario Saludable</h4>
        <p className="text-xs text-gray-500 mt-1">No hay productos en nivel crítico.</p>
      </div>
    );
  }

  // Escenario 2: Mostrar lista de alertas
  return (
    <ul className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto custom-scrollbar">
      {alerts.map((alert, index) => {
        // Determinamos si está completamente agotado o solo bajo
        const stockActual = alert.stockActual ?? alert.stock ?? 0;
        const estaAgotado = stockActual <= 0;

        return (
          <li key={alert.id || index} className="px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              
              {/* Información del Producto */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {alert.producto || alert.productName || 'Producto Desconocido'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Mínimo requerido: {alert.stockMinimo || alert.minStock || 10}
                </span>
              </div>

              {/* Indicador Numérico */}
              <div className="flex flex-col items-end ml-3 shrink-0">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-md ${
                  estaAgotado 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {stockActual} unid.
                </span>
                <span className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${
                  estaAgotado ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {estaAgotado ? 'Agotado' : 'Crítico'}
                </span>
              </div>

            </div>
          </li>
        );
      })}
    </ul>
  );
}