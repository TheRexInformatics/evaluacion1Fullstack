import { useState, useEffect } from 'react';
import { getProductos, getStocks } from '../facade/BffFacade';

export default function StoreContainer({ userName, onPedidoCreado }) {
  const [productos, setProductos] = useState([]);
  const [stocks, setStocks] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, stks] = await Promise.all([getProductos(), getStocks()]);
      setProductos(prods);
      const stockMap = {};
      stks.forEach(s => {
        const pid = s.producto?.id || s.productoId;
        stockMap[pid] = (stockMap[pid] || 0) + (s.cantidad || 0);
      });
      setStocks(stockMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addToCart = (producto) => {
    setCarrito(prev => {
      const existing = prev.find(c => c.productoId === producto.id);
      if (existing) {
        return prev.map(c => c.productoId === producto.id ? { ...c, cantidad: c.cantidad + 1 } : c);
      }
      return [...prev, { productoId: producto.id, codigoProducto: producto.sku, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  };

  const updateCantidad = (productoId, delta) => {
    setCarrito(prev => prev.map(c => {
      if (c.productoId !== productoId) return c;
      const nueva = c.cantidad + delta;
      return nueva <= 0 ? null : { ...c, cantidad: nueva };
    }).filter(Boolean));
  };

  const totalCarrito = carrito.reduce((sum, c) => sum + c.precio * c.cantidad, 0);

  const handleCheckout = async () => {
    if (carrito.length === 0) return;
    setCheckingOut(true);
    setError(null);
    try {
      for (const item of carrito) {
        const stockDisponible = stocks[item.productoId] || 0;
        if (item.cantidad > stockDisponible) {
          throw new Error(`Sin stock suficiente para ${item.nombre}. Disponible: ${stockDisponible}`);
        }
      }

      const results = [];
      for (const item of carrito) {
        const response = await fetch('http://localhost:8080/api/pedidos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('smartlogix_token')}`,
          },
          body: JSON.stringify({
            productoId: item.productoId,
            codigoProducto: item.codigoProducto,
            cantidad: item.cantidad,
            clienteId: userName,
          }),
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || `Error al crear pedido para ${item.nombre}`);
        }
        results.push(await response.json());
      }
      setCarrito([]);
      onPedidoCreado?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6">
        <div className="text-center py-12 text-slate-400">Cargando productos...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
      )}

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tienda SmartLogix</h2>
              <p className="text-xs text-slate-500 mt-0.5">{productos.length} productos disponibles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200">
                <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-indigo-200">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-800">{p.nombre}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{p.descripcion}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-slate-800">${Number(p.precio).toLocaleString()}</span>
                    <span className={`text-xs font-medium ${(stocks[p.id] || 0) === 0 ? 'text-red-500' : (stocks[p.id] || 0) < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {(stocks[p.id] || 0)} unid.
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={(stocks[p.id] || 0) <= 0}
                    className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-lg transition-colors">
                    {(stocks[p.id] || 0) <= 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-indigo-500">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Carrito ({carrito.length})
              </h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {carrito.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">Tu carrito está vacío</div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {carrito.map((item) => (
                    <li key={item.productoId} className="px-5 py-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.nombre}</p>
                          <p className="text-xs text-slate-500">${Number(item.precio).toLocaleString()} c/u</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCantidad(item.productoId, -1)}
                            className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 text-xs">−</button>
                          <span className="text-sm font-semibold text-slate-700 w-6 text-center">{item.cantidad}</span>
                          <button onClick={() => updateCantidad(item.productoId, 1)}
                            disabled={item.cantidad >= (stocks[item.productoId] || 0)}
                            className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 text-xs">+</button>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">${Number(item.precio * item.cantidad).toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {carrito.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total</span>
                  <span className="text-lg font-bold text-slate-800">${Number(totalCarrito).toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors">
                  {checkingOut ? 'Procesando pedido...' : 'Comprar ahora'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
