package com.smartlogix.pedidos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoEventoDTO {
    private Long id;
    private Long productoId;
    private String codigoProducto;
    private Integer cantidad;
    private BigDecimal total;
    private String estado;
    private String clienteId;
    private LocalDateTime fechaCreacion;
}
