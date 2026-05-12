package com.smartlogix.pedidos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoDTO {
    private Long id;
    private Long clienteId;

    // Un pedido tiene una LISTA de productos
    private List<ProductoDTO> productos;

    private BigDecimal total; // Usamos BigDecimal igual que en Producto

    private String sagaStatus;
}