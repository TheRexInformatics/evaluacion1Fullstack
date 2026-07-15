import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { crearPedido, formatCurrency } from '../facade/BffFacade';
import Button from './ui/Button';

export default function CartDropdown({ userName }) {
  const { carrito, updateCantidad, clearCart, totalCarrito, itemsCount } = useCart();
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (carrito.length === 0) return;
    setCheckingOut(true);
    setError(null);
    try {
      for (const item of carrito) {
        await crearPedido({
          productoId: item.productoId,
          codigoProducto: item.codigoProducto,
          cantidad: item.cantidad,
          clienteId: userName,
        });
      }
      clearCart();
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg text-white/30 hover:bg-white/5 hover:text-white/60 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {itemsCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-lavender text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-night-purple">
            {itemsCount > 9 ? '9+' : itemsCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-night-purple rounded-xl shadow-2xl border border-lavender/10 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-lavender/10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Carrito ({itemsCount})</h3>
              {carrito.length > 0 && (
                <button onClick={clearCart} className="text-xs text-white/30 hover:text-tomato transition-colors">Vaciar</button>
              )}
            </div>

            {error && (
              <div className="mx-4 mt-3 p-3 bg-tomato/10 border border-tomato/20 text-tomato rounded-lg text-xs">{error}</div>
            )}

            <div className="max-h-[320px] overflow-y-auto">
              {carrito.length === 0 ? (
                <div className="px-4 py-8 text-center text-white/30 text-sm">Tu carrito está vacío</div>
              ) : carrito.map(item => (
                <div key={item.productoId} className="px-4 py-3 border-b border-white/5 hover:bg-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.nombre}</p>
                      <p className="text-xs text-white/40">{formatCurrency(item.precio)} c/u</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="w-6 h-6 min-h-0 p-0 text-xs"
                        onClick={() => updateCantidad(item.productoId, -1)}>−</Button>
                      <span className="text-sm font-semibold text-white w-6 text-center">{item.cantidad}</span>
                      <Button size="sm" variant="secondary" className="w-6 h-6 min-h-0 p-0 text-xs"
                        onClick={() => updateCantidad(item.productoId, 1)}>+</Button>
                    </div>
                    <span className="text-sm font-semibold text-white tabular-nums">{formatCurrency(item.precio * item.cantidad)}</span>
                  </div>
                </div>
              ))}
            </div>

            {carrito.length > 0 && (
              <div className="px-4 py-3 border-t border-lavender/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="font-sans text-lg font-bold text-white tabular-nums">{formatCurrency(totalCarrito)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  loading={checkingOut}
                  className="w-full">
                  {checkingOut ? 'Procesando...' : 'Comprar ahora'}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
