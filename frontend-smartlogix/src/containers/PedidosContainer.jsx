import { useState, useEffect } from 'react';
import { getPedidos, getDetallePedido } from '../facade/BffFacade';
import RecentOrdersTable from '../components/RecentOrdersTable';
import ModalPedido from '../components/ModalPedido';

export default function PedidosContainer() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para Filtros
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busquedaId, setBusquedaId] = useState('');

  // Estados para el Modal de la Saga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Cargar datos reales al montar el componente
  useEffect(() => {
    cargarPedidosRest();
  }, []);

  const cargarPedidosRest = async () => {
    try {
      setLoading(true);
      // Llama a tu microservicio real a través del Gateway
      const data = await getPedidos();
      setPedidos(data || []);
    } catch (err) {
      setError("Error al cargar los pedidos desde el servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función que se ejecuta al hacer clic en un pedido de la tabla
  const handleVerDetalle = async (id) => {
    setIsModalOpen(true);
    setLoadingDetalle(true);
    try {
      const detalle = await getDetallePedido(id);
      setPedidoSeleccionado(detalle);
    } catch (err) {
      console.error("Error al obtener detalle del pedido", err);
      // Fallback: Si el detalle falla, pasamos los datos básicos de la tabla
      const pedidoBasico = pedidos.find(p => p.id === id);
      setPedidoSeleccionado(pedidoBasico);
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Lógica de Filtros Reales
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchEstado = filtroEstado === 'TODOS' || 
                        pedido.sagaStatus === filtroEstado || 
                        pedido.estado === filtroEstado; // Por si tu DB usa 'estado' en lugar de 'sagaStatus'
    const matchId = busquedaId === '' || String(pedido.id).includes(busquedaId);
    return matchEstado && matchId;
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos (Saga)</h2>
        <button onClick={cargarPedidosRest} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition">
          🔄 Refrescar Datos
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Tu componente Presenter Visual (La tabla) */}
      <RecentOrdersTable 
        pedidos={pedidosFiltrados} 
        loading={loading}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        onVerDetalle={handleVerDetalle} // Le pasamos la función para abrir el modal
      />

      {/* Renderizado del Modal */}
      <ModalPedido 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pedido={pedidoSeleccionado}
        loading={loadingDetalle}
      />
    </div>
  );
}