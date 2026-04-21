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
        Boolean tieneStock = inventarioClient.checkStock(pedido.getCodigoProducto(), pedido.getCantidad());
        if (tieneStock == null || !tieneStock) {
            throw new RuntimeException("Sin stock suficiente");
        }

        ProductoDTO producto = inventarioClient.getProductoById(pedido.getProductoId());
        pedido.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(pedido.getCantidad())));
        pedido.setEstado("PROCESADO");

        return pedidoRepository.save(pedido);
    }

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    // ESTO ES LO QUE FALTABA IMPLEMENTAR
    @Override
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }
}