import { useState, useEffect } from 'react';
import { getPedidos, crearEnvio, getEnvioByPedidoId, actualizarEstadoEnvio } from '../facade/BffFacade';
import Button from '../components/ui/Button';

const ESTADOS_FLUJO = ['PREPARACION', 'EN_TRANSITO', 'ENTREGADO'];
const ESTADO_COLORS = {
  PREPARACION: { bg: 'bg-lavender/10', text: 'text-lavender', border: 'border-lavender/20', dot: 'bg-lavender' },
  EN_TRANSITO: { bg: 'bg-goldenrod/10', text: 'text-goldenrod', border: 'border-goldenrod/20', dot: 'bg-goldenrod' },
  ENTREGADO:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  INCIDENCIA: { bg: 'bg-tomato/10', text: 'text-tomato', border: 'border-tomato/20', dot: 'bg-tomato' },
  CANCELADO:  { bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10', dot: 'bg-white/30' },
};

export default function EnviosContainer() {
  const [pedidos, setPedidos] = useState([]);
  const [envios, setEnvios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [pedidoIdInput, setPedidoIdInput] = useState('');
  const [direccion, setDireccion] = useState('');
  const [transportistaInput, setTransportistaInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const pedidosList = await getPedidos();
      setPedidos(pedidosList);
      const enviosMap = {};
      await Promise.all(pedidosList.map(async p => {
        try { enviosMap[p.id] = await getEnvioByPedidoId(p.id); } catch {}
      }));
      setEnvios(enviosMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { const id = setInterval(loadData, 15000); return () => clearInterval(id); }, []);

  const handleCrearEnvio = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await crearEnvio(parseInt(pedidoIdInput), direccion);
      setShowCreate(false);
      setPedidoIdInput('');
      setDireccion('');
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const handleAvanzarEstado = async (envio) => {
    const idx = ESTADOS_FLUJO.indexOf(envio.estado);
    if (idx < ESTADOS_FLUJO.length - 1) {
      setActionLoading(true);
      try {
        await actualizarEstadoEnvio(envio.id, ESTADOS_FLUJO[idx + 1], transportistaInput || undefined);
        await loadData();
      } catch (err) { setError(err.message); }
      finally { setActionLoading(false); }
    }
  };

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
          <h2 className="font-sans text-lg font-bold text-white">Envíos</h2>
          <p className="text-xs text-white/40 mt-0.5">{pedidos.length} pedidos en sistema</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Crear Envío
        </Button>
      </div>

      {showCreate && (
        <div className="bg-night-purple rounded-xl shadow-lg border border-lavender/10 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Nuevo Envío</h3>
          <form onSubmit={handleCrearEnvio} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">ID del Pedido</label>
                <input required type="number" value={pedidoIdInput} onChange={e => setPedidoIdInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Dirección</label>
                <input required value={direccion} onChange={e => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-lavender/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-lavender/30 focus:border-lavender/40 outline-none" placeholder="Av. Principal 123" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={actionLoading} loading={actionLoading}>
                {actionLoading ? 'Creando...' : 'Crear Envío'}
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Pedido ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Destino</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Tracking</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Transportista</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-white/40 text-sm">Cargando envíos...</td></tr>
              ) : pedidos.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-white/40 text-sm">No hay pedidos en el sistema.</td></tr>
              ) : pedidos.map(p => {
                const envio = envios[p.id];
                const col = envio ? ESTADO_COLORS[envio.estado] || ESTADO_COLORS.PREPARACION : null;
                const idx = envio ? ESTADOS_FLUJO.indexOf(envio.estado) : -1;
                const puedeAvanzar = idx >= 0 && idx < ESTADOS_FLUJO.length - 1;

                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-share-tech text-xs font-semibold text-lavender">#{p.id}</td>
                    <td className="px-5 py-3.5 text-white/60">{envio?.direccionDestino || '—'}</td>
                    <td className="px-5 py-3.5">
                      {envio ? (
                        <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/60 border border-lavender/10">{envio.codigoSeguimiento}</code>
                      ) : (
                        <span className="text-xs text-white/30">Sin envío</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {envio ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${col.bg} ${col.text} border ${col.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                          {envio.estado}
                        </span>
                      ) : (
                        <span className="text-xs bg-white/5 text-white/30 px-2 py-1 rounded-full border border-white/10">Sin envío</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-white/60">{envio?.transportista || '—'}</td>
                    <td className="px-5 py-3.5">
                      {envio && puedeAvanzar ? (
                        <Button size="sm" variant="ghost" className="text-lavender bg-lavender/10 hover:bg-lavender/20"
                          onClick={() => handleAvanzarEstado(envio)} disabled={actionLoading} loading={actionLoading}>
                          {actionLoading ? '...' : `→ ${ESTADOS_FLUJO[idx + 1]}`}
                        </Button>
                      ) : envio?.estado === 'ENTREGADO' ? (
                        <span className="text-xs text-emerald-400 font-medium">✓ Completado</span>
                      ) : !envio ? (
                        <span className="text-xs text-white/20">—</span>
                      ) : (
                        <span className="text-xs text-white/30">{envio.estado}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
