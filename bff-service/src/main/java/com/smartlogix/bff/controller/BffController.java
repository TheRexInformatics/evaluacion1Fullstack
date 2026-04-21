package com.smartlogix.bff.controller;

import com.smartlogix.bff.dto.ResumenCompraDTO;
import com.smartlogix.bff.service.BffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bff")
@RequiredArgsConstructor
public class BffController {

    private final BffService bffService;

    @GetMapping("/resumen-compra/{pedidoId}")
    public ResponseEntity<ResumenCompraDTO> getResumen(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(bffService.obtenerResumenCompleto(pedidoId));
    }
}