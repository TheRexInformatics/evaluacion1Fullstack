package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.service.ProductoService;
import com.smartlogix.inventario.exception.ResourceNotFoundException; // <-- Importación añadida
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/check-stock")
    public ResponseEntity<Boolean> checkStock(
            @RequestParam("sku") String sku,
            @RequestParam("cantidad") Integer cantidad) {
        return ResponseEntity.ok(productoService.verificarStockTotal(sku, cantidad));
    }

    @PutMapping("/reducir-stock")
    public ResponseEntity<Void> reducirStock(
            @RequestParam("sku") String sku,
            @RequestParam("cantidad") Integer cantidad) {
        // Dejamos que el service lance su RuntimeException (ej. "Stock insuficiente")
        // Tu GlobalException la atrapará como un 500 o puedes mapearla luego.
        productoService.reducirStockGlobal(sku, cantidad);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<Producto> findAll() {
        return productoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> findById(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("El producto con ID " + id + " no existe."));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<Producto> findBySku(@PathVariable String sku) {
        return productoService.findBySku(sku)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("El producto con SKU " + sku + " no existe."));
    }

    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        Producto saved = productoService.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto producto) {
        // Si el service no lo encuentra, internamente debería lanzar una excepción o nosotros validarla aquí
        Producto updated = productoService.update(id, producto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}