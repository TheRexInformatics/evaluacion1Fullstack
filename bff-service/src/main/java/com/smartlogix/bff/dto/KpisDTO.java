package com.smartlogix.bff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpisDTO {
    private long totalPedidos;
    private BigDecimal ingresos;
    private long entregados;
    private long pendientes;
}
