import React from 'react';

export default function ModalPedido({ isOpen, onClose, pedido, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60">
      <div className="relative w-full max-w-2xl p-4">
        <div className="relative bg-night-purple rounded-2xl shadow-2xl border border-lavender/10 flex flex-col">
          
          <div className="flex items-center justify-between p-5 border-b border-lavender/10 rounded-t">
            <h3 className="font-pixelify text-xl font-semibold text-white">
              Detalle del Pedido {pedido?.id ? `#${pedido.id}` : ''}
            </h3>
            <button 
              onClick={onClose}
              className="text-white/30 hover:bg-white/5 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors"
            >
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="text-white/40">Cargando detalles desde el microservicio...</span>
              </div>
            ) : pedido ? (
              <>
                {pedido.sagaStatus === 'CANCELLED' && (
                  <div className="p-4 mb-4 text-sm text-tomato rounded-lg bg-tomato/10 border border-tomato/20" role="alert">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">⚠️</span>
                      <span className="font-bold text-base">Transacción Interrumpida (Compensación Saga)</span>
                    </div>
                    <p>
                      El pedido fue cancelado automáticamente porque uno de los microservicios falló. <br/>
                      <strong>Motivo reportado:</strong> {pedido.motivoFallo || "Fallo en validación de Stock o Envío."}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-lavender/10">
                    <p className="text-sm text-white/40">Estado de la Saga</p>
                    <p className={`font-bold ${
                      pedido.sagaStatus === 'CONFIRMED' ? 'text-emerald-400' :
                      pedido.sagaStatus === 'CANCELLED' ? 'text-tomato' :
                      'text-goldenrod'
                    }`}>
                      {pedido.sagaStatus || 'PENDING'}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-lavender/10">
                    <p className="text-sm text-white/40">Cliente ID</p>
                    <p className="font-semibold text-white">{pedido.clienteId || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Artículos</h4>
                  <ul className="divide-y divide-white/5 border border-lavender/10 rounded-lg px-4">
                    <li className="py-3 flex justify-between">
                      <span className="text-white/50">ID Producto: {pedido.productoId || 'N/A'}</span>
                      <span className="font-semibold text-white">Cant: {pedido.cantidad || 1}</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-center text-white/40">No se pudo cargar la información.</p>
            )}
          </div>

          <div className="flex items-center justify-end p-5 border-t border-lavender/10">
            <button 
              onClick={onClose}
              className="text-white bg-lavender hover:bg-lavender/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
