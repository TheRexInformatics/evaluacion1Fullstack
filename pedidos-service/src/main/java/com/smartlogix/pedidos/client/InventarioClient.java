package com.smartlogix.pedidos.client;

import com.smartlogix.pedidos.model.ProductoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventario-service", url = "${inventario.service.url}")
public interface InventarioClient {

    @GetMapping("/api/productos/check-stock")
    Boolean checkStock(@RequestParam("codigo") String codigo, @RequestParam("cantidad") Integer cantidad);

    @PutMapping("/api/productos/reducir-stock")
    void reducirStock(@RequestParam("codigo") String codigo, @RequestParam("cantidad") Integer cantidad);

    @GetMapping("/api/productos/{id}")
    ProductoDTO getProductoById(@PathVariable("id") Long id);
}