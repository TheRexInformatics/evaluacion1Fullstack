package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class PedidoDTO {
    private Long id;
    private Long productoId;
    private Integer cantidad;
    private String estado;
}