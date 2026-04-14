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

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final InventarioClient inventarioClient;

    @Override
    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        Boolean tieneStock = inventarioClient.checkStock(pedido.getCodigoProducto(), pedido.getCantidad());
        if (tieneStock == null || !tieneStock) {
            throw new RuntimeException("Sin stock suficiente para el producto: " + pedido.getCodigoProducto());
        }

        ProductoDTO producto = inventarioClient.getProductoById(pedido.getProductoId());
        if (producto == null) throw new RuntimeException("Producto no encontrado");

        pedido.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(pedido.getCantidad())));
        pedido.setEstado("PROCESADO");

        Pedido guardado = pedidoRepository.save(pedido);

        inventarioClient.reducirStock(pedido.getCodigoProducto(), pedido.getCantidad());

        return guardado;
    }

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }
}