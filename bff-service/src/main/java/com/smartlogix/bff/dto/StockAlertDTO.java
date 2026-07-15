package com.smartlogix.bff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAlertDTO {
    private Long id;
    private String producto;
    private Integer stockActual;
    private Integer stockMinimo;
}
