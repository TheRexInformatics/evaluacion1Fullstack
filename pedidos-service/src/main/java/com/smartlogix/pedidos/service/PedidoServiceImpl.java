package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.client.InventarioClient;
import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.model.ProductoDTO;
import com.smartlogix.pedidos.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final InventarioClient inventarioClient;

    @Override
    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        // LOGS PARA RASTREAR EL ERROR
        System.out.println("DEBUG: Verificando SKU: " + pedido.getCodigoProducto() + " Cantidad: " + pedido.getCantidad());

        // 1. Llamada al micro de Inventario
        Boolean tieneStock = inventarioClient.checkStock(pedido.getCodigoProducto(), pedido.getCantidad());

        System.out.println("DEBUG: ¿Inventario reporta stock?: " + tieneStock);

        if (tieneStock == null || !tieneStock) {
            throw new RuntimeException("Sin stock suficiente para: " + pedido.getCodigoProducto());
        }

        // 2. Obtener detalles para el precio
        ProductoDTO producto = inventarioClient.getProductoById(pedido.getProductoId());

        if (producto == null) {
            throw new RuntimeException("El producto no existe en el sistema de inventario.");
        }

        // 3. Procesar y Guardar
        pedido.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(pedido.getCantidad())));
        pedido.setEstado("PROCESADO");

        // Opcional: Reducir el stock físicamente después de crear el pedido
        inventarioClient.reducirStock(pedido.getCodigoProducto(), pedido.getCantidad());

        return pedidoRepository.save(pedido);
    }

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }
}