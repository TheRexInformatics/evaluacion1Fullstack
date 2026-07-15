import { useState, useEffect } from 'react';
import { getProductos, crearProducto, getStocks, entradaStock, salidaStock, formatCurrency } from '../facade/BffFacade';
import Button from '../components/ui/Button';

export default function InventarioContainer() {
  const [productos, setProductos] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [stockModal, setStockModal] = useState(null);
  const [newProducto, setNewProducto] = useState({ nombre: '', descripcion: '', precio: '', sku: '' });
  const [cantidad, setCantidad] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, stks] = await Promise.all([getProductos(), getStocks()]);
      setProductos(prods);
      setStocks(stks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { const id = setInterval(loadData, 15000); return () => clearInterval(id); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await crearProducto({ ...newProducto, precio: parseFloat(newProducto.precio) });
      setShowCreate(false);
      setNewProducto({ nombre: '', descripcion: '', precio: '', sku: '' });
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const handleStockAction = async (tipo) => {
    setActionLoading(true);
    try {
      if (tipo === 'entrada') {
        await entradaStock(stockModal.productoId, stockModal.bodegaId || 1, parseInt(cantidad));
      } else {
        await salidaStock(stockModal.productoId, stockModal.bodegaId || 1, parseInt(cantidad));
      }
      setStockModal(null);
      setCantidad('');
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const stockPorProducto = {};
  stocks.forEach(s => {
    const pid = s.producto?.id || s.productoId;
    if (!stockPorProducto[pid]) stockPorProducto[pid] = 0;
    stockPorProducto[pid] += s.cantidad || 0;
  });

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8 max-w-screen-2xl mx-auto w-full">
      {error && (
        <div className="bg-tomato/10 border border-tomato/20 text-tomato rounded-xl p-4 text-sm flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-lg font-bold text-white">Inventario</h2>
          <p className="text-xs text-white/40 mt-0.5">{productos.length} productos</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nuevo Producto
        </Button>
      </div>

      {showCreate && (
        <div className="bg-night-purple rounded-xl shadow-lg border border-lavender/10 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Crear Producto</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Nombre</label>
                <input required value={newProducto.nombre} onChange={e => setNewProducto(p => ({...p, nombre: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">SKU</label>
                <input required value={newProducto.sku} onChange={e => setNewProducto(p => ({...p, sku: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Precio</label>
                <input required type="number" step="0.01" value={newProducto.precio} onChange={e => setNewProducto(p => ({...p, precio: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-white/60 mb-1">Descripción</label>
                <input value={newProducto.descripcion} onChange={e => setNewProducto(p => ({...p, descripcion: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={actionLoading} loading={actionLoading}>
                {actionLoading ? 'Creando...' : 'Crear'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-night-purple rounded-xl shadow-lg border border-lavender/10 overflow-clip">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-lavender/10">
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Producto</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">SKU</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Precio</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-white/40 text-sm">Cargando...</td></tr>
              ) : productos.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-white/40 text-sm">No hay productos. Crea el primero.</td></tr>
              ) : productos.map(p => {
                const stock = stockPorProducto[p.id] || 0;
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-white">{p.nombre}</span>
                      <span className="block text-xs text-white/40 truncate max-w-[200px]">{p.descripcion}</span>
                    </td>
                    <td className="px-5 py-3.5"><code className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/60 border border-lavender/10">{p.sku}</code></td>
                    <td className="px-5 py-3.5 text-white font-semibold tabular-nums">{formatCurrency(p.precio)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${stock === 0 ? 'text-tomato' : stock < 10 ? 'text-goldenrod' : 'text-emerald-400'}`}>
                        {stock} unid.
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          onClick={() => { setStockModal({ productoId: p.id }); setCantidad(''); }}>+ Entrada</Button>
                        <Button size="sm" variant="secondary" className="bg-goldenrod/10 text-goldenrod border-goldenrod/20 hover:bg-goldenrod/20"
                          onClick={() => { setStockModal({ productoId: p.id }); setCantidad(''); }}>- Salida</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {productos.length > 0 && (
              <tfoot>
                <tr className="border-t border-lavender/10 bg-white/[0.02]">
                  <td className="px-5 py-3 text-xs font-semibold text-white/40" colSpan={2}>
                    {productos.length} producto{productos.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-white/50 tabular-nums">
                    Valor total: {formatCurrency(productos.reduce((sum, p) => {
                      const stock = stockPorProducto[p.id] || 0;
                      return sum + (Number(p.precio) * stock);
                    }, 0))}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-white/40">
                    {Object.values(stockPorProducto).reduce((a, b) => a + b, 0)} unid.
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {stockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setStockModal(null)}>
          <div className="bg-night-purple rounded-2xl shadow-2xl border border-lavender/10 p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-4">Cantidad</h3>
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-lavender/15 rounded-xl text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none mb-4" placeholder="1" autoFocus />
            <div className="flex gap-3 justify-end">
              <Button onClick={() => handleStockAction('entrada')} disabled={!cantidad || actionLoading} loading={actionLoading}
                className="bg-emerald-500 hover:bg-emerald-600">{actionLoading ? 'Procesando...' : 'Entrada'}</Button>
              <Button onClick={() => handleStockAction('salida')} disabled={!cantidad || actionLoading} loading={actionLoading}
                className="bg-goldenrod hover:bg-goldenrod/90">{actionLoading ? 'Procesando...' : 'Salida'}</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
