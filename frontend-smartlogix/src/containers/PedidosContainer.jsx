import { useState, useEffect } from 'react';
import { getPedidos, getDetallePedido, compensarPedido, completarPedido } from '../facade/BffFacade';
import RecentOrdersTable from '../components/RecentOrdersTable';
import ModalPedido from '../components/ModalPedido';

export default function PedidosContainer({ clienteId }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busquedaId, setBusquedaId] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    cargarPedidosRest();
    const interval = setInterval(cargarPedidosRest, 15_000);
    return () => clearInterval(interval);
  }, []);

  const cargarPedidosRest = async () => {
    try {
      setLoading(true);
      const data = await getPedidos();
      setPedidos(data || []);
    } catch (err) {
      setError("Error al cargar los pedidos desde el servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (id) => {
    setIsModalOpen(true);
    setLoadingDetalle(true);
    try {
      const detalle = await getDetallePedido(id);
      setPedidoSeleccionado(detalle);
    } catch (err) {
      console.error("Error al obtener detalle del pedido", err);
      const pedidoBasico = pedidos.find(p => p.id === id);
      setPedidoSeleccionado(pedidoBasico);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchEstado = filtroEstado === 'TODOS' || 
                        pedido.sagaStatus === filtroEstado || 
                        pedido.estado === filtroEstado;
    const matchId = busquedaId === '' || String(pedido.id).includes(busquedaId);
    const matchCliente = !clienteId || pedido.clienteId === clienteId;
    return matchEstado && matchId && matchCliente;
  });

  const handleCancelar = async (id) => {
    try {
      await compensarPedido(id);
      await cargarPedidosRest();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompletar = async (id) => {
    try {
      await completarPedido(id);
      await cargarPedidosRest();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-screen-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-sans text-lg font-bold text-white">{clienteId ? 'Mis Pedidos' : 'Gestión de Pedidos'}</h2>
          <p className="text-xs text-white/40 mt-0.5">{clienteId ? 'Tus compras' : 'Saga Pattern activo'}</p>
        </div>
        <button onClick={cargarPedidosRest} className="flex items-center gap-2 px-4 py-2 bg-lavender/10 text-lavender rounded-xl text-sm font-medium hover:bg-lavender/20 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          Refrescar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-tomato/10 border border-tomato/20 text-tomato rounded-xl text-sm">
          {error}
        </div>
      )}

      <RecentOrdersTable 
        pedidos={pedidosFiltrados} 
        loading={loading}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        onVerDetalle={handleVerDetalle}
        onCancelar={handleCancelar}
        onCompletar={handleCompletar}
        clienteId={clienteId}
      />

      <ModalPedido 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pedido={pedidoSeleccionado}
        loading={loadingDetalle}
      />
    </div>
  );
}
