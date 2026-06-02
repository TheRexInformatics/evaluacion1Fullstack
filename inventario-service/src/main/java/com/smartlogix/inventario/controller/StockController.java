package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.service.StockService;
import com.smartlogix.inventario.exception.ResourceNotFoundException; // <-- Importación añadida
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public List<Stock> findAll() {
        return stockService.findAll();
    }

    @GetMapping("/bodega/{bodegaId}")
    public List<Stock> findByBodega(@PathVariable Long bodegaId) {
        return stockService.findByBodega(bodegaId);
    }

    @GetMapping("/producto/{productoId}/bodega/{bodegaId}")
    public ResponseEntity<Stock> findByProductoAndBodega(@PathVariable Long productoId,
                                                         @PathVariable Long bodegaId) {
        return stockService.findByProductoAndBodega(productoId, bodegaId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró stock para el producto " + productoId + " en la bodega " + bodegaId));
    }

    @PostMapping("/entrada")
    public ResponseEntity<Stock> registrarEntrada(@RequestParam Long productoId,
                                                  @RequestParam Long bodegaId,
                                                  @RequestParam Integer cantidad) {
        Stock stock = stockService.registrarEntrada(productoId, bodegaId, cantidad);
        return ResponseEntity.ok(stock);
    }

    @PostMapping("/salida")
    public ResponseEntity<Stock> registrarSalida(@RequestParam Long productoId,
                                                 @RequestParam Long bodegaId,
                                                 @RequestParam Integer cantidad) {
        // Al quitar el try-catch, si no hay suficiente stock en esa bodega,
        // la excepción de negocio sube limpia al manejador global.
        Stock stock = stockService.registrarSalida(productoId, bodegaId, cantidad);
        return ResponseEntity.ok(stock);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Stock> actualizarStock(@RequestParam Long productoId,
                                                 @RequestParam Long bodegaId,
                                                 @RequestParam Integer nuevaCantidad) {
        Stock stock = stockService.actualizarStock(productoId, bodegaId, nuevaCantidad);
        return ResponseEntity.ok(stock);
    }
}