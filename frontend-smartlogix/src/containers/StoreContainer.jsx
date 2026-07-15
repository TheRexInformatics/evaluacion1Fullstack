import { useState, useEffect } from 'react';
import { getProductos, getStocks } from '../facade/BffFacade';
import { useCart } from '../context/CartContext';

export default function StoreContainer() {
  const [productos, setProductos] = useState([]);
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

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

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6">
        <div className="text-center py-12 text-white/40">Cargando productos...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {error && (
        <div className="mb-4 p-4 bg-tomato/10 border border-tomato/20 text-tomato rounded-xl text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-pixelify text-lg font-bold text-white">Tienda SmartLogix</h2>
          <p className="text-xs text-white/40 mt-0.5">{productos.length} productos disponibles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {productos.map(p => (
          <div key={p.id} className="bg-night-purple rounded-xl shadow-lg border border-lavender/10 overflow-hidden hover:shadow-xl hover:border-lavender/20 transition-all duration-200">
            <div className="h-40 bg-gradient-to-br from-lavender/10 to-mystic-light/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-lavender/20">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white">{p.nombre}</h3>
              <p className="text-xs text-white/40 mt-0.5 truncate">{p.descripcion}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-pixelify text-lg font-bold text-white tabular-nums">${Number(p.precio).toLocaleString()}</span>
                <span className={`text-xs font-medium ${(stocks[p.id] || 0) === 0 ? 'text-tomato' : (stocks[p.id] || 0) < 5 ? 'text-goldenrod' : 'text-emerald-400'}`}>
                  {(stocks[p.id] || 0)} unid.
                </span>
              </div>
              <button
                onClick={() => addToCart(p)}
                disabled={(stocks[p.id] || 0) <= 0}
                className="mt-3 w-full py-2 bg-lavender hover:bg-lavender/90 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-semibold rounded-lg transition-colors">
                {(stocks[p.id] || 0) <= 0 ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
