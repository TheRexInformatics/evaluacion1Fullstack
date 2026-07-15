package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.client.InventarioClient;
import com.smartlogix.pedidos.dto.PedidoDTO;
import com.smartlogix.pedidos.dto.PedidoEventoDTO;
import com.smartlogix.pedidos.dto.ProductoDTO;
import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.publisher.PedidoEventPublisher;
import com.smartlogix.pedidos.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final InventarioClient inventarioClient;
    private final PedidoEventPublisher pedidoEventPublisher;

    @Override
    @Transactional
    public PedidoDTO crearPedido(PedidoDTO pedidoDTO) {
        // 1. Validar Stock vía Feign
        Boolean tieneStock;
        try {
            tieneStock = inventarioClient.checkStock(pedidoDTO.getCodigoProducto(), pedidoDTO.getCantidad());
        } catch (Exception e) {
            throw new RuntimeException("Error al consultar stock: " + e.getMessage());
        }
        if (tieneStock == null || !tieneStock) {
            throw new RuntimeException("Sin stock para: " + pedidoDTO.getCodigoProducto());
        }

        // 2. Obtener precio del producto
        ProductoDTO producto;
        try {
            producto = inventarioClient.getProductoById(pedidoDTO.getProductoId());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener producto: " + e.getMessage());
        }
        if (producto == null) {
            throw new RuntimeException("Producto no encontrado con ID: " + pedidoDTO.getProductoId());
        }

        // 3. Mapear DTO a Entidad para persistencia
        Pedido pedido = new Pedido();
        pedido.setProductoId(pedidoDTO.getProductoId());
        pedido.setCodigoProducto(pedidoDTO.getCodigoProducto());
        pedido.setCantidad(pedidoDTO.getCantidad());
        pedido.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(pedidoDTO.getCantidad())));
        pedido.setEstado("PROCESADO");
        pedido.setSagaStatus("PENDING");
        pedido.setClienteId(pedidoDTO.getClienteId());

        // 4. Guardar en DB local y reducir stock remoto
        Pedido guardado = pedidoRepository.save(pedido);
        try {
            inventarioClient.reducirStock(pedido.getCodigoProducto(), pedido.getCantidad());
        } catch (Exception e) {
            throw new RuntimeException("Error al reducir stock: " + e.getMessage());
        }

        PedidoEventoDTO evento = new PedidoEventoDTO(
                guardado.getId(), guardado.getProductoId(), guardado.getCodigoProducto(),
                guardado.getCantidad(), guardado.getTotal(), guardado.getEstado(),
                guardado.getClienteId(), LocalDateTime.now());
        pedidoEventPublisher.publicarPedidoCreado(evento);

        return mapearADTO(guardado);
    }

    @Override
    @Transactional
    public PedidoDTO compensarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + id));

        pedido.setSagaStatus("CANCELLED");
        pedido.setEstado("CANCELADO");
        Pedido actualizado = pedidoRepository.save(pedido);

        PedidoEventoDTO evento = new PedidoEventoDTO(
                actualizado.getId(), actualizado.getProductoId(), actualizado.getCodigoProducto(),
                actualizado.getCantidad(), actualizado.getTotal(), actualizado.getEstado(),
                actualizado.getClienteId(), LocalDateTime.now());
        pedidoEventPublisher.publicarPedidoCancelado(evento);

        try {
            inventarioClient.restaurarStock(pedido.getCodigoProducto(), pedido.getCantidad());
        } catch (Exception e) {
            System.err.println("Fallo restauración de stock: " + e.getMessage());
        }

        return mapearADTO(actualizado);
    }

    @Override
    @Transactional
    public PedidoDTO completarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + id));

        pedido.setEstado("COMPLETADO");
        pedido.setSagaStatus("COMPLETED");
        Pedido actualizado = pedidoRepository.save(pedido);
        return mapearADTO(actualizado);
    }

    @Override
    public List<PedidoDTO> findAll() {
        return pedidoRepository.findAll().stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoDTO findById(Long id) {
        return pedidoRepository.findById(id)
                .map(this::mapearADTO)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + id));
    }

    private PedidoDTO mapearADTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setProductoId(pedido.getProductoId());
        dto.setCodigoProducto(pedido.getCodigoProducto());
        dto.setCantidad(pedido.getCantidad());
        dto.setTotal(pedido.getTotal());
        dto.setEstado(pedido.getEstado());
        dto.setSagaStatus(pedido.getSagaStatus());
        dto.setClienteId(pedido.getClienteId());
        return dto;
    }
}